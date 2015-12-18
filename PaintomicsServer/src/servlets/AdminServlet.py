#***************************************************************
#  This file is part of Paintomics v3
#
#  Paintomics is free software: you can redistribute it and/or
#  modify it under the terms of the GNU General Public License as
#  published by the Free Software Foundation, either version 3 of
#  the License, or (at your option) any later version.
#
#  Paintomics is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with Paintomics.  If not, see <http://www.gnu.org/licenses/>.
#
#  More info http://bioinfo.cipf.es/paintomics
#  Technical contact paintomics@cipf.es
#**************************************************************
import logging
import logging.config
import json
from os import path as os_path
from shutil import rmtree as shutil_rmtree

from src.common.UserSessionManager import UserSessionManager
from src.common.ServerErrorManager import handleException
from src.common.DAO.UserDAO import UserDAO
from src.common.DAO.JobDAO import JobDAO
from src.common.DAO.FileDAO import FileDAO

from src.common.Util import sendEmail

from src.conf.serverconf import MONGODB_HOST, MONGODB_PORT, ROOT_DIRECTORY, KEGG_DATA_DIR, CLIENT_TMP_DIR, smpt_sender, smpt_sender_name, MAX_CLIENT_SPACE
from src.servlets.DataManagementServlet import dir_total_size

def adminServletGetInstalledOrganisms(request, response):
    try :
        logging.info("STEP0 - CHECK IF VALID USER....")
        #****************************************************************
        # Step 0.CHECK IF VALID USER SESSION
        #****************************************************************
        userID  = request.cookies.get('userID')
        sessionToken  = request.cookies.get('sessionToken')
        UserSessionManager().isValidUser(userID, sessionToken)

        #****************************************************************
        # Step 1.GET THE LIST OF INSTALLED SPECIES (DATABASES and SPECIES.JSON)
        #****************************************************************
        with open(KEGG_DATA_DIR + 'last/species/species.json') as installedSpeciesFile:
            installedSpecies = json.load(installedSpeciesFile)
        installedSpeciesFile.close()

        installedSpecies = installedSpecies.get("species")
        from pymongo import MongoClient

        client = MongoClient(MONGODB_HOST, MONGODB_PORT)
        databases = client.database_names()

        #****************************************************************
        # Step 2.FOR EACH INSTALLED DATABASE GET THE INFORMATION
        #****************************************************************
        databaseList=[]
        common_info_date=""

        for database in databases:
            if not "-paintomics" in database:
                continue
            elif "global-paintomics" == database:
                db = client[database]
                common_info_date = db.versions.find({"name": "COMMON"})[0].get("date")
            else:
                # Step 2.1 GET THE SPECIE CODE
                organism_code=database.replace("-paintomics", "")
                organism_name=""

                # Step 2.2 GET THE SPECIE NAME
                for installedSpecie in installedSpecies:
                    if installedSpecie["value"] == organism_code:
                        organism_name= installedSpecie["name"]
                        break

                if organism_name == "":
                    organism_name = "Erroneous organism, not at SPECIES.JSON"

                # Step 2.3 GET THE SPECIE VERSIONS
                db = client[database]
                kegg_date = db.versions.find({"name": "KEGG"})[0].get("date")
                mapping_date = db.versions.find({"name": "MAPPING"})[0].get("date")
                acceptedIDs = db.versions.find({"name": "ACCEPTED_IDS"})

                if acceptedIDs.count() > 0:
                    acceptedIDs = acceptedIDs[0].get("ids")
                else:
                    acceptedIDs = ""
                databaseList.append({
                    "organism_name" : organism_name,
                    "organism_code" : organism_code,
                    "kegg_date"     : kegg_date,
                    "mapping_date"  : mapping_date,
                    "acceptedIDs"   : acceptedIDs
                })

        client.close()

        response.setContent({"common_info_date" : common_info_date, "databaseList": databaseList})

    except Exception as ex:
        handleException(response, ex, __file__ , "adminServletGetInstalledOrganisms")

    finally:
        return response

def adminServletUpdateOrganism(request, response):
    """
    This function manages an 'Update Organism' request by calling to the
    DBManager tool.

    @param {Request} request, the request object
    @param {Response} response, the response object
    """
    try :
        logging.info("STEP0 - CHECK IF VALID USER....")
        #****************************************************************
        # Step 0.CHECK IF VALID USER SESSION
        #****************************************************************
        userID  = request.cookies.get('userID')
        sessionToken  = request.cookies.get('sessionToken')
        UserSessionManager().isValidUser(userID, sessionToken)

        #****************************************************************
        # Step 1.GET THE SPECIE CODE AND THE UPDATE OPTION
        #****************************************************************
        formFields = request.form
        organism_code  = formFields.get("organism_code")
        just_install  = formFields.get("just_install") == "true"
        option = formFields.get("option")

        update_kegg=0
        update_mapping=0
        common = 0

        if (organism_code != "common" and option == "updateKegg") or option == "all":
            update_kegg=1
        if (organism_code != "common" and option == "updateMapping") or option == "all":
            update_mapping=1

        if organism_code == "common":
            common = 1
            organism_code = "#common"

        from subprocess import check_output, CalledProcessError, STDOUT

        if option != "reinstallData" and just_install != True:
            logging.info("STARTING DBManager Download PROCESS.")
            scriptArgs = [ROOT_DIRECTORY + "AdminTools/DBManager.py", "download", "--specie=" + organism_code, "--kegg=" + str(update_kegg), "--mapping=" + str(update_mapping), "--common=" + str(common)]
            try:
                check_output(scriptArgs, stderr=STDOUT)
            except CalledProcessError as exc:
                raise Exception("Error while calling DBManager Download: Exit status " + str(exc.returncode) + ". Error message: " + exc.output)
            logging.info("FINISHED DBManager Download PROCESS.")

        logging.info("STARTING DBManager Install PROCESS.")
        scriptArgs = [ROOT_DIRECTORY + "AdminTools/DBManager.py", "install", "--specie=" + organism_code, "--common=" + str(common)]
        try:
            check_output(scriptArgs, stderr=STDOUT)
        except CalledProcessError as exc:
            raise Exception("Error while calling DBManager Install: Exit status " + str(exc.returncode) + ". Error message: " + exc.output)
        logging.info("FINISHED DBManager Install PROCESS.")

        response.setContent({"success": True})

    except Exception as ex:
        handleException(response, ex, __file__ , "adminServletUpdateOrganism")

    finally:
        return response

def adminServletRestoreData(request, response):
    """
    This function...

    @param {Request} request, the request object
    @param {Response} response, the response object
    """
    try :
        logging.info("STEP0 - CHECK IF VALID USER....")
        #****************************************************************
        # Step 0.CHECK IF VALID USER SESSION
        #****************************************************************
        userID  = request.cookies.get('userID')
        sessionToken  = request.cookies.get('sessionToken')
        UserSessionManager().isValidUser(userID, sessionToken)

        #****************************************************************
        # Step 1.GET THE SPECIE CODE AND THE UPDATE OPTION
        #****************************************************************
        formFields = request.form

        from subprocess import check_output, CalledProcessError, STDOUT

        logging.info("STARTING DBManager Restore PROCESS.")
        scriptArgs = [ROOT_DIRECTORY + "AdminTools/DBManager.py", "restore", "--remove=1", "--force=1"]
        try:
            check_output(scriptArgs, stderr=STDOUT)
        except CalledProcessError as exc:
            raise Exception("Error while calling DBManager Restore: Exit status " + str(exc.returncode) + ". Error message: " + exc.output)
        logging.info("FINISHED DBManager Restore PROCESS.")

        response.setContent({"success": True})

    except Exception as ex:
        handleException(response, ex, __file__ , "adminServletRestoreData")

    finally:
        return response

def adminServletSendReport(request, response):
    """
    This function...

    @param {Request} request, the request object
    @param {Response} response, the response object
    """
    try :
        logging.info("STEP0 - CHECK IF VALID USER....")
        #****************************************************************
        # Step 0.CHECK IF VALID USER SESSION
        #****************************************************************
        userID  = request.cookies.get('userID')
        sessionToken  = request.cookies.get('sessionToken')
        UserSessionManager().isValidUser(userID, sessionToken)

        userEmail = UserDAO().findByID(userID)
        userName = userEmail.getUserName()
        userEmail = userEmail.getEmail()

        #****************************************************************
        # Step 1.GET THE SPECIE CODE AND THE UPDATE OPTION
        #****************************************************************
        formFields = request.form

        type = formFields.get("type")
        _message = formFields.get("message")

        title = "Other request"
        color = "#333"

        if type == "error":
            type = "Error notification"
            title = "<h1>New error notification</h1>"
            color = "#f95959"
        elif type == "specie_request":
            type = "New specie requesting"
            title = "<h1>New organism requested</h1>"
            color = "#0090ff"
        else:
            type = "Other request"

        message = '<html><body>'
        message +=  "<a href='" + "http://bioinfo.cipf.es/paintomics/" + "' target='_blank'>"
        message += "  <img src='cid:image1' border='0' width='auto' height='50' alt='Paintomics 3 logo'>"
        message += "</a>"
        message += "<div style='width:100%; height:10px; border-top: 1px dotted #333; margin-top:20px; margin-bottom:30px;'></div>"
        message += "<h1>"+ title + "</h1>"
        message += "<p>Thanks for the report, " + userName + "!</p>"
        message += "<p><b>Username:</b> " + userEmail + "</p></br>"
        message += "<div style='width:100%; border: 1px solid " + color +"; padding:10px;font-family: monospace;color:"+ color + ";'>" + _message + "</div>"
        message += "<p>We will contact you as soon as possible.</p>"
        message += "<p>Best regards,</p>"
        message += "<p>The Paintomics developers team.</p>"
        message += "<div style='width:100%; height:10px; border-top: 1px dotted #333; margin-top:20px; margin-bottom:30px;'></div>"
        message += "<p>Problems? E-mail <a href='mailto:" + "paintomics@cipf.es" + "'>" + "paintomics@cipf.es" + "</a></p>"
        message += '</body></html>'

        sendEmail(smpt_sender, smpt_sender_name, type, message, fromEmail=userEmail, fromName=userName, isHTML=True)

        response.setContent({"success": True})

    except Exception as ex:
        handleException(response, ex, __file__ , "adminServletSendReport")

    finally:
        return response

def adminServletGetAllUsers(request, response):
    """
    This function...

    @param {Request} request, the request object
    @param {Response} response, the response object
    """
    try :
        logging.info("STEP0 - CHECK IF VALID USER....")
        #****************************************************************
        # Step 0.CHECK IF VALID USER SESSION
        #****************************************************************
        userID  = request.cookies.get('userID')
        sessionToken  = request.cookies.get('sessionToken')
        UserSessionManager().isValidUser(userID, sessionToken)

        #****************************************************************
        # Step 1. GET THE LIST OF ALL USERS
        #****************************************************************
        logging.info("STEP1 - GET THE LIST OF ALL USERS...")
        userList = UserDAO().findAll()
        for userInstance in userList:
            userInstance.usedSpace = 0
            if os_path.isdir(CLIENT_TMP_DIR + str(userInstance.getUserId())):
                userInstance.usedSpace = dir_total_size(CLIENT_TMP_DIR + str(userInstance.getUserId()))

        response.setContent({"success": True, "userList": userList,  "availableSpace": MAX_CLIENT_SPACE})

    except Exception as ex:
        handleException(response, ex, __file__ , "adminServletGetAllUsers")

    finally:
        return response

def adminServletCleanOldData(request, response):
    """
    This function...

    @param {Request} request, the request object
    @param {Response} response, the response object
    """
    try :
        logging.info("STEP0 - CHECK IF VALID USER....")
        #****************************************************************
        # Step 0.CHECK IF VALID USER SESSION
        #****************************************************************
        userID  = request.cookies.get('userID')
        sessionToken  = request.cookies.get('sessionToken')
        UserSessionManager().isValidUser(userID, sessionToken)

        #****************************************************************
        # Step 1. GET THE LIST OF ALL USERS
        #****************************************************************
        formFields = request.form
        user_ids  = formFields.get("user_ids").split(",")

        allJobs = None
        jobDAOInstance = JobDAO()
        filesDAOInstance = FileDAO()
        userDAOInstance = UserDAO()

        for userID in user_ids:
            if userID == "0":
                continue

            logging.info("STEP1 - CLEANING DATA FOR " + userID + "...")

            #****************************************************************
            # Step 2. DELETE ALL JOBS FOR THE USER
            #****************************************************************
            allJobs = jobDAOInstance.findAll(otherParams={"userID":userID})
            jobID = ""
            for jobInstance in allJobs:
                jobID = jobInstance.getJobID()
                logging.info("STEP2 - REMOVING " + jobID + " FROM DATABASE...")
                jobDAOInstance.remove(jobInstance.getJobID(), otherParams={"userID":userID})

            #****************************************************************
            # Step 3. DELETE ALL FILES FOR THE USER
            #****************************************************************
            logging.info("STEP3 - REMOVING ALL FILES FROM DATABASE...")
            filesDAOInstance.removeAll(otherParams={"userID":userID})
            logging.info("STEP3 - REMOVING ALL FILES FROM USER DIRECTORY...")
            if os_path.isdir(CLIENT_TMP_DIR + userID):
                shutil_rmtree(CLIENT_TMP_DIR + userID)

            #****************************************************************
            # Step 4. DELETE THE USER INSTANCE FROM DATABASE
            #****************************************************************
            logging.info("STEP6 - REMOVING ALL FILES FROM DATABASE...")
            userDAOInstance.remove(int(userID))

        response.setContent({"success": True})

    except Exception as ex:
        handleException(response, ex, __file__ , "adminServletCleanOldData")

    finally:
        return response