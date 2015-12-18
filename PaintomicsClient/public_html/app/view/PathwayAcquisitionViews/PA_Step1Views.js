/* global Ext, APP_VERSION, dragula */

//@ sourceURL=PA_Step1Views.js
/*
* (C) Copyright 2014 The Genomics of Gene Expression Lab, CIPF
* (http://bioinfo.cipf.es/aconesawp) and others.
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the GNU Lesser General Public License
* (LGPL) version 3 which accompanies this distribution, and is available at
* http://www.gnu.org/licenses/lgpl.html
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
* Lesser General Public License for more details.
*
* Contributors:
*     Rafael Hernandez de Diego
*     rhernandez@cipf.es
*     Ana Conesa Cegarra
*     aconesa@cipf.es
* THIS FILE CONTAINS THE FOLLOWING COMPONENT DECLARATION
* - PA_Step1JobView
* - OmicSubmittingPanel
* - RegionBasedOmicSubmittingPanel
*/
function PA_Step1JobView() {
	/*********************************************************************
	* ATTRIBUTES
	***********************************************************************/
	this.name = "PA_Step1JobView";
	this.nFiles = 0;
	this.exampleMode = false;

	/*********************************************************************
	* GETTERS AND SETTERS
	***********************************************************************/
	this.isExampleMode = function() {
		return this.exampleMode;
	};

	/*********************************************************************
	* OTHER FUNCTIONS
	***********************************************************************/
	/**
	* This function remove all panels and reset the application.
	*/
	this.resetViewHandler = function() {
		this.controller.resetButtonClickHandler(this);
	};
	/**
	* This function adds a new OmicSubmittingPanel for the given type.
	* @param {type} type for the new omic panel.
	*/
	this.addNewOmicSubmittingPanel = function(type) {
		var newElem, submitForm;

		if (type === "geneexpression") {
			newElem = new OmicSubmittingPanel(this.nFiles, {
				type: "Gene expression",
				fileType: "Gene Expression file",
				relevantFileType: "Relevant Genes list"
			});
		} else if (type === "proteomics") {
			newElem = new OmicSubmittingPanel(this.nFiles, {
				type: "Proteomics",
				fileType: "Proteomic quatification",
				relevantFileType: "Relevant proteins list"
			});
		} else if (type === "metabolomics") {
			newElem = new OmicSubmittingPanel(this.nFiles, {
				type: "Metabolomics",
				fileType: "Metabolomic quatification",
				relevantFileType: "Relevant Compound list"
			});
		} else if (type === "mirnaseq") {
			newElem = new OmicSubmittingPanel(this.nFiles, {
				type: "miRNA-Seq",
				fileType: "miRNA-Seq quatification",
				relevantFileType: "Relevant miRNA-Seq list"
			});
		} else if (type === "dnaseseq") {
			newElem = new OmicSubmittingPanel(this.nFiles, {
				type: "DNAse-Seq",
				fileType: "DNAse-Seq quatification",
				relevantFileType: "Relevant DNAse-Seq list"
			});
			// newElem = new RegionBasedOmicSubmittingPanel(this.nFiles, {
			// type: "DNAse-Seq",
			// fileType: "DNAse-Seq quatification",
			// relevantFileType: "Relevant DNAse-Seq list"
			// });
		} else if (type === "bedbasedomic") {
			newElem = new RegionBasedOmicSubmittingPanel(this.nFiles);
		} else if (type === "otheromic") {
			newElem = new OmicSubmittingPanel(this.nFiles);
		}
		newElem.setParent(this);

		submitForm = this.getComponent().queryById("submittingPanelsContainer");
		submitForm.insert(1, newElem.getComponent()).focus();

		if (type !== "otheromic" && type !== "bedbasedomic") {
			$("div.availableOmicsBox[title=" + type + "]").css("display", "none");
		}

		if (submitForm.items.getCount() > 2) {
			$(".dragHerePanel").fadeOut();
		}

		this.nFiles++;

		return newElem;
	};
	/**
	* This function removes a given omicSubmittingPanel and restores the omic type
	* at the availableOmics panel.
	*
	* @param {OmicSubmittingPanel} omicSubmittingPanel
	*/
	this.removeOmicSubmittingPanel = function(omicSubmittingPanel) {
		var submitForm = this.getComponent().queryById("submittingPanelsContainer");
		submitForm.remove(omicSubmittingPanel.getComponent());

		if (omicSubmittingPanel.type !== "otheromic" && omicSubmittingPanel.type !== "bedbasedomic" && !this.exampleMode) {
			$("div.availableOmicsBox[title=" + omicSubmittingPanel.type + "]").fadeIn();
		}

		if (submitForm.items.getCount() === 2 && !this.exampleMode) {
			$(".dragHerePanel").fadeIn();
		}

		delete omicSubmittingPanel;
	};
	/**
	* This function sets the Example mode for the first step.
	*/
	this.setExampleModeHandler = function() {
		var panel, fileField, omicSubmittingPanels;

		this.exampleMode = true;

		this.getComponent().queryById("speciesCombobox").setValue("mmu");
		this.getComponent().queryById("speciesCombobox").setReadOnly(true);

		omicSubmittingPanels = this.getComponent().queryById("submittingPanelsContainer").query("[cls=omicbox]");

		for (var i in omicSubmittingPanels) {
			$("#" + omicSubmittingPanels[i].el.id + " a.deleteOmicBox").click();
		}

		this.addNewOmicSubmittingPanel("mirnaseq").setExampleMode();
		this.addNewOmicSubmittingPanel("dnaseseq").setExampleMode();
		this.addNewOmicSubmittingPanel("proteomics").setExampleMode();
		this.addNewOmicSubmittingPanel("metabolomics").setExampleMode();
		this.addNewOmicSubmittingPanel("geneexpression").setExampleMode();


		$("#availableOmicsContainer").css("display", "none");
		$("#exampleButton").css("display", "none");


		showInfoMessage("About this example", {
			message: 'The following example data was loaded:' +
			'<ul>' +
			'  <li>Gene Expression data: 6404 genes [4195 relevant genes].</li>' +
			'  <li>Proteomics data: 556 proteins [52 relevant proteins].</li>' +
			'  <li>Metalomics data: 59 compounds [21 relevant compounds].</li>' +
			'  <li>DNase-seq data: 18330 regions [3595 relevant regions].</li>'+
			'  <li>miRNA-seq data: 69 genes with miRNA values [69 relevant genes].</li>'+
			'</ul>',
			showButton: true,
			height: 240
		});
	};

	/**
	* This function is called when the user press the "Run Paintomics" button.
	* First we get all the RegionBasedOmic panels.
	* If there is one or more panel which contains to-be-processed BED files then
	* we send first those panels to server for processing "step1SubmitRegionBasedOmics".
	*
	* If there is not RegionBasedOmic panels or they contain already processed files
	* then we call to normal execution "step1OnFormSubmitHandler".
	*
	*/
	this.submitFormHandler = function() {
		var aux, regionBasedOmics;

		regionBasedOmics = this.getComponent().queryById("submittingPanelsContainer").query("container[cls=omicbox regionBasedOmic]");
		for (var i = regionBasedOmics.length; i--;) {
			aux = regionBasedOmics[i].queryById("itemsContainer");
			if (aux === null || aux.isDisabled()) {
				regionBasedOmics.splice(i, 1);
			}
		}

		if (regionBasedOmics.length > 0) {
			this.controller.step1SubmitRegionBasedOmics(this, regionBasedOmics);
		} else {
			this.controller.step1OnFormSubmitHandler(this);
		}
	};
	/**
	* This function checks the validity for each OmicSubmittingPanel
	*
	* @returns Boolean
	*/
	this.checkForm = function() {
		var items, valid, emptyFields;

		items = this.getComponent().query("container[cls=omicbox], container[cls=omicbox regionBasedOmic]");
		valid = this.getComponent().queryById("speciesCombobox").isValid();
		for (var i in items) {
			valid = valid && items[i].isValid();
		}

		emptyFields = 0;
		for (var i in items) {
			if (items[i].isEmpty() === true) {
				emptyFields++;
				$(items[i].getEl().dom).find("a.deleteOmicBox").click();
			}
		}

		return valid && (emptyFields < items.length);
	};

	//    this.showMyDataPanel = function () {
	//        this.controller.showMyDataPanelClickHandler(this);
	//    };

	this.initComponent = function() {
		var me = this;
		this.component = Ext.widget({
			xtype: "container",
			minHeight: 800,
			padding: '10',
			items: [{
				xtype: "box",
				cls: "toolbar secondTopToolbar",
				html: '<a href="javascript:void(0)" class="button acceptButton" id="submitButton"><i class="fa fa-play"></i> Run Paintomics</a>' +
				'<a href="javascript:void(0)" class="button exampleButton" id="exampleButton"><i class="fa fa-file-text-o"></i> Load example</a>' +
				'<a href="javascript:void(0)" class="button cancelButton" id="resetButton" style="float:right"><i class="fa fa-refresh"></i> Reset</a>'
			}, {
				xtype: 'box',
				cls: "contentbox",
				style: "margin-top:50px; max-width:1300px",
				html: '<div id="about">' +
				' <h2>Welcome to PaintOmics (' + APP_VERSION + ')</h2>' +
				' <p>' +
				'   <b>Paintomics</b>  is a web tool for the integrative visualization of multiple omic datasets onto KEGG pathways.</br>' +
				'   <b>Paintomics</b> consists of three simple steps:' +
				' </p>' +
				' <ul> ' +
				'   <li><b>Data uploading:</b> typically data matrices, containing, for example, gene expression, metabolite levels and metabolite levels for the same set of samples.</li> ' +
				"   <li><b>Identifier and Name Matching and Metabolite assignment:</b> as Paintomics requires Entrez IDs for working with KEGG pathways, the tool will try to convert the names and identifiers from different sources and databases for the input data. Additionally, it's necessary to specify of metabolite assignments in ambiguity cases.</li>" +
				'   <li><b>Pathway selection:</b> finally, Paintomics will obtain the list of KEGG Pathway that are ?.</li>' +
				' </ul>' +
				' <p>' +
				'   Currently <b>Paintomics</b> supports integrated visualization of multipel species of different biological kingdoms and offers user the possibility to request any other organism present in the KEGG database.</br>' +
				'   Please check the user guide for further information. For any question on <b>Paintomics</b>, users can send a mail to <a href="mailto:paintomics@cipf.es">paintomics@cipf.es</a>.' +
				' </p>' +
				'</div>'
			}, {
				xtype: 'form',
				maxWidth: 1300,
				bodyCls: "contentbox",
				layout: {type: 'vbox', align: 'stretch'},
				defaults: {labelAlign: "right", border: false},
				items: [
					{xtype: "box", flex: 1, html:'<h2>Data uploading</h2><h3>1. Organism selection </h3>'},
					{
						xtype: 'combo',fieldLabel: 'Organism', name: 'specie',
						maxWidth: 450,
						itemId: "speciesCombobox",
						allowBlank: false,
						forceSelection: true,
						emptyText: 'Please choose an organism',
						displayField: 'name',
						valueField: 'value',
						editable: false,
						store: Ext.create('Ext.data.ArrayStore', {
							fields: ['name', 'value'],
							autoLoad: true,
							proxy: {
								type: 'ajax',
								url: SERVER_URL_GET_AVAILABLE_SPECIES,
								reader: {
									type: 'json',
									root: 'species',
									successProperty: 'success'
								}
							}
						})
					},
					{
						xtype: "box", flex: 1, html:
						'<span class="infoTip" style=" font-size: 12px; margin-left: 120px; margin-bottom: 10px;">'+
						' Not your organism? Request new organisms <a href="javascript:void(0)" id="newOrganismRequest" style="color: rgb(211, 21, 108);">clicking here</a>.' +
						'</span>'
					},{
						xtype: "box",
						html: '<h3>2. Choose the files to upload </h3>'
					}, {
						xtype: "container",
						layout: 'hbox',
						items: [{
							xtype: "box",
							id: "availableOmicsContainer",
							minHeight: 400,
							width: 250,
							padding: 10,
							html: '<h2 style="text-align:center;">Available omics</h2>' +
							'<div class="availableOmicsBox" title="geneexpression"><h4><a href="javascript:void(0)"><i class="fa fa-plus-circle"></i></a> Gene Expression</h4></div>' +
							'<div class="availableOmicsBox" title="metabolomics"><h4><a href="javascript:void(0)"><i class="fa fa-plus-circle"></i></a> Metabolomics</h4></div>' +
							'<div class="availableOmicsBox" title="proteomics"><h4><a href="javascript:void(0)"><i class="fa fa-plus-circle"></i></a> Proteomics</h4></div>' +
							'<div class="availableOmicsBox" title="bedbasedomic"><h4><a href="javascript:void(0)"><i class="fa fa-plus-circle"></i></a> Region based omic</h4></div>' +
							'<div class="availableOmicsBox" title="otheromic"><h4><a href="javascript:void(0)"><i class="fa fa-plus-circle"></i></a> Other omic</h4></div>'
						}, {
							xtype: "container",
							id: "submittingPanelsContainer",
							minHeight: 150,
							minWidth: 200,
							maxWidth: 600,
							margin: 10,
							flex: 1,
							layout: {type: 'vbox',align: "stretch"},
							items: [
								{xtype: 'box',html: '<h2  style="text-align:center;">Selected omics</h2>'},
								{xtype: 'box',html: '<p class="dragHerePanel">Drag and drop here your selected <i>omics</i></p>'}
							]
						}]
					}

				]
			}],
			listeners: {
				boxready: function() {
					$("#submitButton").click(function() {
						me.submitFormHandler();
					});
					$("#exampleButton").click(function() {
						me.setExampleModeHandler();
					});
					$("#resetButton").click(function() {
						me.resetViewHandler();
					});
					$("#addOtherDataButton").click(function() {
						me.addNewOmicSubmittingPanel();
					});
					$("#newOrganismRequest").click(function() {
						application.getController("DataManagementController").requestNewSpecieHandler();
					});

					$(".availableOmicsBox a").click(function(){
						var type = $(this).parents(".availableOmicsBox").first().attr("title");
						me.addNewOmicSubmittingPanel(type);
					});


					var containers = [$("#availableOmicsContainer")[0], $("#submittingPanelsContainer-targetEl")[0]];

					//INITIALIZE THE DRAG AND DROP
					dragula(containers, {
						moves: function(el, container, handle) {
							// elements are always draggable by default
							return el.tagName !== "H5" && container.id !== "submittingPanelsContainer-targetEl";
						}
					}).on("drop", function(el, container, source) {
						if (container.id === "submittingPanelsContainer-targetEl") {
							var type = $(el).attr("title");
							me.addNewOmicSubmittingPanel(type);
						}
						this.cancel(true);
					});


					me.addNewOmicSubmittingPanel("metabolomics");
					me.addNewOmicSubmittingPanel("geneexpression");
				},
				beforedestroy: function() {
					me.getModel().deleteObserver(me);
				}
			}
		});

		return this.component;
	};

	return this;
}
PA_Step1JobView.prototype = new View();

function OmicSubmittingPanel(nElem, options) {
	/*********************************************************************
	* ATTRIBUTES
	***********************************************************************/
	options = (options || {});

	this.title = "Other data type";
	this.namePrefix = "omic" + nElem;
	this.omicName = "";
	this.mapTo = "Gene";
	this.fileType = null;
	this.relevantFileType = null;

	this.class = "otherFileBox";

	/*IF THE TYPE WAS SPECIFIED (e.g. gene_expression)*/
	if (options.type !== undefined) {
		//TODO CAPITALIZE THE FIRST LETTER
		this.omicName = options.type;
		this.title = options.type;

		if (['Metabolomics'].indexOf(options.type) !== -1) {
			this.mapTo = "Compound";
		}

		this.fileType = options.fileType;
		this.relevantFileType = options.relevantFileType;
		this.type = this.title.replace(" ", "").toLowerCase();
		this.class = this.type + "FileBox";
	}
	/*********************************************************************
	* GETTERS AND SETTERS
	***********************************************************************/
	this.getOmicName = function() {
		return this.omicName;
	};
	/***********************************************************************
	* OTHER FUNCTIONS
	***********************************************************************/
	this.removeOmicSubmittingPanel = function() {
		this.getParent().removeOmicSubmittingPanel(this);
	};
	this.setExampleMode = function(){
		var fileField = this.getComponent().queryById("mainFileSelector");
		fileField.setValue("example/" + this.type + "_example.tab");
		fileField.setDisabled(true);

		fileField = this.getComponent().queryById("secondaryFileSelector");
		fileField.setValue("example/" + this.type + "_relevant_example");
		fileField.setDisabled(true);
	};
	/*********************************************************************
	* COMPONENT DECLARATION
	***********************************************************************/
	this.initComponent = function() {
		var me = this;

		this.component = Ext.widget({
			xtype: "container", flex: 1, cls: "omicbox",
			type: me.type, layout: {align: 'stretch',type: 'vbox'},
			items: [
				{
					xtype: "box", flex: 1, cls: "omicboxTitle " + this.class, html:
					'<h4>' +
					' <a class="deleteOmicBox" href="javascript:void(0)" style="margin: 0; float:right;  padding-right: 15px;"><i class="fa fa-trash"></i></a>' +
					this.title +
					'</h4>'
				}, {
					xtype: "container",
					layout: {align: 'stretch',type: 'vbox'},
					padding: 10,
					defaults: {
						labelAlign: "right",
						labelWidth: 150,
						maxLength: 100,
						maxWidth: 500
					},
					items: [
						{
							xtype: 'combo',
							fieldLabel: 'Omic Name',
							name: this.namePrefix + '_omic_name',
							value: this.omicName,
							hidden: this.omicName !== "",
							itemId: "omicNameField",
							displayField: 'name',
							valueField: 'name',
							emptyText: 'Type or choose the omic type',
							editable: true,
							allowBlank: false,
							queryMode: 'local',
							store: Ext.create('Ext.data.ArrayStore', {
								fields: ['name'],
								autoLoad: true,
								proxy: {
									type: 'ajax',
									url: 'resources/data/all_omics.json',
									reader: {
										type: 'json',
										root: 'omics',
										successProperty: 'success'
									}
								}
							})
						}, {
							xtype: "myFilesSelectorButton",
							fieldLabel: 'Data file',
							namePrefix: this.namePrefix,
							itemId: "mainFileSelector",
							helpTip: "Upload the feature quantification file (Gene expression, proteomics quantification,...) or choose it from your data folder."
						}, {
							xtype: 'combo', itemId: "fileTypeSelector",
							fieldLabel: 'File Type', emptyText: 'Type or choose the file type',
							name: this.namePrefix + '_file_type',
							hidden: this.omicName !== "",
							displayField: 'name', valueField: ' name',
							editable: true, allowBlank: false,
							value: (this.fileType !== null) ? this.fileType : null,
							store: Ext.create('Ext.data.ArrayStore', {
								fields: ['name', 'type'],
								autoLoad: true,
								proxy: {
									type: 'ajax',
									url: 'resources/data/file_types.json',
									reader: {type: 'json', root: 'types', successProperty: 'success'}
								},
								filterOnLoad:true,
								filters: [{property: 'type', value : 'data'}]
							}),
							helpTip: "Specify the type of data for uploaded file (Gene Expression file, Proteomic quatification,...)."
						}, {
							xtype: "myFilesSelectorButton",
							fieldLabel: 'Relevant features file',
							namePrefix: this.namePrefix + '_relevant',
							itemId: "secondaryFileSelector",
							helpTip: "Upload the list of relevant features (relevant genes, relevant proteins,...)."
						}, {
							xtype: 'combo', itemId: "relevantFileTypeSelector",
							fieldLabel: 'File Type', emptyText: 'Type or choose the file type',
							name: this.namePrefix + '_relevant_file_type',
							hidden: this.omicName !== "",
							displayField: 'name', valueField: 'name',
							editable: true, allowBlank: false,
							value: (this.relevantFileType !== null) ? this.relevantFileType : null,
							store: Ext.create('Ext.data.ArrayStore', {
								fields: ['name', 'type'],
								autoLoad: true,
								proxy: {
									type: 'ajax',
									url: 'resources/data/file_types.json',
									reader: {type: 'json', root: 'types', successProperty: 'success'}
								},
								filterOnLoad:true,
								filters: [{property: 'type', value : 'list'}]
							}),

							helpTip: "Specify the type of data for uploaded file (Relevant Genes list, Relevant proteins list,...)."
						}, {
							xtype: 'combo',
							fieldLabel: 'Map to',
							name: this.namePrefix + '_match_type',
							hidden: this.omicName !== "",
							itemId: "mapToSelector",
							displayField: 'name', valueField: ' value',
							emptyText: 'Choose the file type',
							value: this.mapTo,
							editable: false,
							allowBlank: false,
							store: Ext.create('Ext.data.ArrayStore', {
								fields: ['name', 'value'],
								data: [
									['Gene', 'gene'],
									['Compound', 'compound']
								]
							})
						}]
					}, ],
					isValid: function() {
						var valid = true;

						if (this.isEmpty) {
							return true;
						}

						if (this.queryById("omicNameField").getValue() === "") {
							valid = false;
							this.queryById("omicNameField").markInvalid("Please, specify a Omic Name.");
						}
						if (this.queryById("mainFileSelector").getValue() === "") {
							valid = false;
							this.queryById("mainFileSelector").markInvalid("Please, provide a Data file.");
						}
						if (this.queryById("fileTypeSelector").getValue() === null) {
							valid = false;
							this.queryById("fileTypeSelector").markInvalid("Please, specify a File type.");
						}
						if (this.queryById("secondaryFileSelector").getValue() !== "" && this.queryById("relevantFileTypeSelector").getValue() === null) {
							valid = false;
							this.queryById("relevantFileTypeSelector").markInvalid("Please, specify a File type.");
						}
						if (this.queryById("mapToSelector").getValue() === null) {
							valid = false;
							this.queryById("mapToSelector").markInvalid("Please, specify a this field.");
						}

						return valid;
					},
					isEmpty: function() {
						return (this.queryById("secondaryFileSelector").getValue() === "" && this.queryById("mainFileSelector").getValue() === "");
					},
					listeners: {
						boxready: function() {
							initializeTooltips(".helpTip");

							$(this.getEl().dom).find("a.deleteOmicBox").click(function() {
								me.removeOmicSubmittingPanel();
							});
						}
					}
				});

				return this.component;
			};


			return this;
		}
		OmicSubmittingPanel.prototype = new View;

		function RegionBasedOmicSubmittingPanel(nElem, options) {
			/*********************************************************************
			* ATTRIBUTES
			***********************************************************************/
			options = (options || {});

			this.title = "Region based omic";
			this.namePrefix = "omic" + nElem;
			this.omicName = "";
			this.mapTo = "Gene";
			this.fileType = null;
			this.relevantFileType = null;

			this.allowToogle = options.allowToogle !== false;
			this.removable = options.removable !== false;

			this.class = "bedbasedFileBox";

			/*IF THE TYPE WAS SPECIFIED (e.g. gene_expression)*/
			if (options.type !== undefined) {
				//TODO CAPITALIZE THE FIRST LETTER
				this.omicName = options.type;
				this.title = options.type;

				this.fileType = options.fileType;
				this.relevantFileType = options.relevantFileType;
				this.type = this.title.replace(" ", "").toLowerCase();
				this.class = this.type + "FileBox";
			}
			/*********************************************************************
			* GETTERS AND SETTERS
			***********************************************************************/
			this.getOmicName = function() {
				return this.omicName;
			};
			/***********************************************************************
			* OTHER FUNCTIONS
			***********************************************************************/
			this.removeOmicSubmittingPanel = function() {
				this.getParent().removeOmicSubmittingPanel(this);
				return this;
			};
			this.toogleContent = function() {
				var component = this.getComponent().queryById("itemsContainerAlt");
				var isVisible = component.isVisible();
				component.setVisible(!isVisible);
				component.setDisabled(isVisible);

				component = this.getComponent().queryById("itemsContainer");
				if (component) {
					component.setVisible(isVisible);
					component.setDisabled(!isVisible);
				}
				return this;
			};
			this.setExampleMode = function(){
				var component = this.getComponent();
				//component.queryById("toogleMapRegions").setVisible(false);

				component = component.queryById("itemsContainer");

				var field = component.queryById("mainFileSelector");
				field.setValue("example/" + this.type + "_example.tab");
				field.setDisabled(true);

				field = component.queryById("secondaryFileSelector");
				field.setValue("example/" + this.type + "_relevant_example");
				field.setDisabled(true);

				field = component.queryById("tertiaryFileSelector");
				field.setValue("example/mmu_reference.gtf");
				field.setDisabled(true);

				var otherFields = ["distanceField", "tssDistanceField", "promoterDistanceField", "geneAreaPercentageField", "regionAreaPercentageField", "gtfTagField", "summarizationMethodField", "reportSelector1","reportSelector2"];
				for(var i in otherFields){
					field = component.queryById(otherFields[i]);
					field.setReadOnly(true);
				}
			};
			this.setContent = function(target, values) {
				var component = this.getComponent().queryById(target);

				if (values.title) {
					component.queryById("omicNameField").setValue(values.title);
				}
				if (values.omicName) {
					component.queryById("omicNameField").setValue(values.omicName);
				}
				if (values.mainFile) {
					component.queryById("mainFileSelector").setValue(values.mainFile);
				}
				if (values.mainFileType) {
					component.queryById("fileTypeSelector").setValue(values.mainFileType);
				}
				if (values.secondaryFile) {
					component.queryById("secondaryFileSelector").setValue(values.secondaryFile);
				}
				if (values.secondaryFileType) {
					component.queryById("relevantFileTypeSelector").setValue(values.secondaryFileType);
				}
				if (values.toogleMapRegions) {
					component.queryById("toogleMapRegions").setVisible(values.toogleMapRegions === true);
				}

				if (!component.isVisible()) {
					this.toogleContent();
				}
				return this;
			};

			/*********************************************************************
			* COMPONENT DECLARATION
			***********************************************************************/
			this.initComponent = function() {
				var me = this;
				this.component = Ext.widget({
					xtype: "container",
					flex: 1,
					type: me.type,
					cls: "omicbox regionBasedOmic",
					layout: {
						align: 'stretch',
						type: 'vbox'
					},
					items: [{
						xtype: "box",
						flex: 1,
						cls: "omicboxTitle " + this.class,
						html: '<h4><a class="deleteOmicBox" href="javascript:void(0)" style="margin: 0; float:right;  padding-right: 15px;">' +
						(me.removable ? ' <i class="fa fa-trash"></i></a>' : "</a>") + this.title +
						'</h4>'
					}, {
						xtype: "box",
						itemId: "toogleMapRegions",
						hidden: !this.allowToogle,
						html: '<div class="checkbox" style=" margin: 10px 50px; font-size: 16px; "><input type="checkbox" id="' + this.namePrefix + '_mapRegions"><label for="' + this.namePrefix + '_mapRegions">My regions are already mapped to Gene IDs, skip this step.</label></div>'
					}, {
						xtype: "container",
						itemId: "itemsContainerAlt",
						layout: {
							align: 'stretch',
							type: 'vbox'
						},
						padding: 10,
						hidden: true,
						disabled: true,
						defaults: {
							labelAlign: "right",
							labelWidth: 150,
							maxLength: 100,
							maxWidth: 500
						},
						items: [{
							xtype: 'combo',
							fieldLabel: 'Omic Name',
							name: this.namePrefix + '_omic_name',
							value: this.omicName,
							itemId: "omicNameField",
							displayField: 'name',
							valueField: 'name',
							emptyText: 'Type or choose the omic type',
							queryMode: 'local',
							hidden: this.omicName !== "",
							editable: true,
							allowBlank: false,
							store: Ext.create('Ext.data.ArrayStore', {
								fields: ['name'],
								autoLoad: true,
								proxy: {
									type: 'ajax',
									url: 'resources/data/all_omics.json',
									reader: {
										type: 'json',
										root: 'omics',
										successProperty: 'success'
									}
								}
							})
						}, {
							xtype: "myFilesSelectorButton",
							fieldLabel: 'Data file',
							namePrefix: this.namePrefix,
							itemId: "mainFileSelector",
							helpTip: "Upload the feature quantification file (Gene expression, proteomics quantification,...) or choose it from your data folder."
						}, {
							xtype: 'textfield',
							fieldLabel: 'File Type',
							name: this.namePrefix + '_file_type',
							itemId: "fileTypeSelector",
							value: "Bed file (regions mapped to Genes)",
							hidden: true,
							helpTip: "Specify the type of data for uploaded file (Gene Expression file, Proteomic quatification,...)."
						}, {
							xtype: "myFilesSelectorButton",
							fieldLabel: 'Relevant features file',
							namePrefix: this.namePrefix + '_relevant',
							itemId: "secondaryFileSelector",
							helpTip: "Upload the list of relevant features (relevant genes, relevant proteins,...)."
						}, {
							xtype: 'textfield',
							fieldLabel: 'File Type',
							name: this.namePrefix + '_relevant_file_type',
							itemId: "relevantFileTypeSelector",
							value: "Relevant regions list (mapped to Genes)",
							hidden: true,
							helpTip: "Specify the type of data for uploaded file (Relevant Genes list, Relevant proteins list,...)."
						}, {
							xtype: 'textfield',
							fieldLabel: 'Map to',
							name: this.namePrefix + '_match_type',
							itemId: "mapToSelector",
							value: this.mapTo,
							hidden: true
						}]
					}, {
						xtype: "container",
						itemId: "itemsContainer",
						layout: {
							align: 'stretch',
							type: 'vbox'
						},
						padding: 10,
						defaults: {
							labelAlign: "right",
							labelWidth: 150,
							maxLength: 100,
							maxWidth: 500
						},
						items: [{
							xtype: 'textfield',
							name: "name_prefix",
							hidden: true,
							itemId: "namePrefix",
							value: this.namePrefix
						}, {
							xtype: 'combo',
							fieldLabel: 'Omic Name',
							name: this.namePrefix + '_omic_name',
							hidden: this.omicName !== "",
							itemId: "omicNameField",
							displayField: 'name',
							valueField: 'name',
							emptyText: 'Type or choose the omic type',
							editable: true,
							queryMode: 'local',
							allowBlank: false,
							value: (this.fileType !== null) ? this.fileType : null,
							store: Ext.create('Ext.data.ArrayStore', {
								fields: ['name'],
								autoLoad: true,
								proxy: {
									type: 'ajax',
									url: 'resources/data/all_omics.json',
									reader: {
										type: 'json',
										root: 'omics',
										successProperty: 'success'
									}
								}
							})
						}, {
							xtype: 'textfield',
							hidden: true,
							fieldLabel: 'Map to',
							name: this.namePrefix + '_match_type',
							itemId: "mapToSelector",
							value: this.mapTo
						},
						/*REGIONS FILE*/
						{
							xtype: "myFilesSelectorButton",
							fieldLabel: 'Regions file <br>(BED + Quantification)',
							namePrefix: this.namePrefix,
							itemId: "mainFileSelector",
							helpTip: "Upload the regions file (BED format + Quantification) or choose it from your data folder."
						}, {
							xtype: 'textfield',
							fieldLabel: 'File Type',
							name: this.namePrefix + '_file_type',
							hidden: true,
							itemId: "fileTypeSelector",
							value: "Bed file (regions)"
						},
						/*RELEVANT REGIONS FILE*/
						{
							xtype: "myFilesSelectorButton",
							fieldLabel: "Relevant regions file",
							namePrefix: this.namePrefix + '_relevant',
							itemId: "secondaryFileSelector",
							helpTip: "Upload the list of relevant regions (TAB format) or choose it from your data folder."
						}, {
							xtype: 'textfield',
							fieldLabel: 'File Type',
							name: this.namePrefix + '_relevant_file_type',
							hidden: true,
							itemId: "relevantFileTypeSelector",
							value: "Relevant regions list"
						},
						/*ANNOTATIONS FILE*/
						{
							xtype: "myFilesSelectorButton",
							fieldLabel: "Annotations file (GTF)",
							namePrefix: this.namePrefix + '_annotations',
							itemId: "tertiaryFileSelector",
							extraButtons: [{
								text: 'Use a GTF from Paintomics',
								handler: function() {
									var me = this;
									var _callback = function(selectedItem) {
										if (selectedItem !== null) {
											me.up("myFilesSelectorButton").queryById("visiblePathField").setValue("[inbuilt GTF files]/" + selectedItem[0].get("fileName"));
											me.up("myFilesSelectorButton").queryById("originField").setValue("inbuilt_gtf");
										}
									};
									Ext.widget("GTFSelectorDialog").showDialog(_callback);
								}
							}],
							helpTip: "Upload the Annotations file (GTF format), choose it from your data folder or browse the GFT files included in Paintomics."
						}, {
							xtype: 'textfield',
							hidden: true,
							fieldLabel: 'File Type',
							name: this.namePrefix + '_annotations_file_type',
							itemId: "referenceFileTypeSelector",
							value: "GTF file"
						},
						/*
						* OTHER FIELDS
						*/
						//report
						{
							xtype: 'textfield',
							hidden: true,
							name: this.namePrefix + '_report',
							fieldLabel: 'Report',
							value: "gene"
						},
						//distance
						{
							xtype: 'numberfield',
							itemId: "distanceField",
							name: this.namePrefix + '_distance',
							fieldLabel: 'Distance (kb)',
							value: 10,
							minValue: 0,
							allowDecimals: false,
							allowBlank: false,
							helpTip: "Maximum distance in kb to report associations. Default: 10 (10kb)"
						},
						//tss
						{
							xtype: 'numberfield',
							itemId: "tssDistanceField",
							name: this.namePrefix + '_tss',
							fieldLabel: 'TSS region distance (bps)',
							value: 200,
							minValue: 0,
							allowDecimals: false,
							allowBlank: false,
							helpTip: "TSS region distance. Default: 200 bps"
						},
						//promoter
						{
							xtype: 'numberfield',
							itemId: "promoterDistanceField",
							name: this.namePrefix + '_promoter',
							fieldLabel: 'Promoter region distance (bps)',
							value: 1300,
							minValue: 0,
							allowDecimals: false,
							allowBlank: false,
							helpTip: "Promoter region distance. Default: 1300 bps"
						},
						//geneAreaPercentage
						{
							xtype: 'numberfield',
							itemId: "geneAreaPercentageField",
							name: this.namePrefix + '_geneAreaPercentage',
							fieldLabel: 'Overlapped gene area (%)',
							value: 50,
							minValue: 0,
							maxValue: 100,
							allowDecimals: false,
							allowBlank: false,
							helpTip: "Percentage of the area of the gene overlapped to be considered to discriminate at transcript and gene level. Default: 90 (90%)"
						},
						//regionAreaPercentage
						{
							xtype: 'numberfield',
							itemId: "regionAreaPercentageField",
							name: this.namePrefix + '_regionAreaPercentage',
							fieldLabel: 'Overlapped region area (%)',
							value: 50,
							minValue: 0,
							maxValue: 100,
							allowDecimals: false,
							allowBlank: false,
							helpTip: "Percentage of the region overlapped by the gene to be considered to discriminate at transcript and gene level. Default: 50 (50%)"
						},
						//rules //TODO
						//{xtype: 'textfield', hidden: true, fieldLabel: 'rules', name: this.namePrefix + '_report', itemId: "reportSelector", value: "gene"},
						//geneIDtag
						{
							xtype: 'textfield',
							itemId: "gtfTagField",
							name: this.namePrefix + '_geneIDtag',
							fieldLabel: 'GTF Tag for gene ID/name ',
							value: "gene_id",
							allowBlank: false,
							helpTip: "GTF tag used to get gene ids/names. Default: gene_id"
						},
						//summarization_method
						{
							xtype: 'combo',
							itemId: "summarizationMethodField",
							name: this.namePrefix + '_summarization_method',
							fieldLabel: 'Summarization method',
							editable: false,
							allowBlank: false,
							value: "mean",
							displayField: 'label',
							valueField: 'value',
							store: Ext.create('Ext.data.ArrayStore', {
								fields: ['label', 'value'],
								data: [
									["None", "none"],
									["Mean", "mean"],
									["Maximum", "max"]
								]
							}),
							helpTip: "Choose the strategy used to resolve regions mapping to the same gen region. Default: 'Mean'"
						}, {
							xtype: 'fieldcontainer',
							fieldLabel: 'Report',
							defaultType: 'radiofield',
							items: [{
								boxLabel: 'All regions',
								itemId: "reportSelector1",
								name: this.namePrefix + '_report',
								submitValue: false,
								checked: true,
								listeners: {
									change: function(radio, newValue, oldValue) {
										radio.up().queryById("reportOptionsContainer").setVisible(!newValue);
										var elems = radio.up().queryById("reportOptionsContainer").query("checkboxfield");
										for (var i in elems) {
											elems[i].setDisabled(newValue);
										}
										elems = radio.up().queryById("reportAllRegionsOption");
										elems.setDisabled(!newValue);
										elems.setValue(newValue);
									}
								}
							}, {
								boxLabel: 'Let me choose',
								itemId: "reportSelector2",
								name: this.namePrefix + '_report',
								submitValue: false,
								helpTip: "Indicates which regions will be selected from rgmatch output. E.g. Option 'First exon' will filter out all regions that do not map into the first exon of the corresponding gene."
							}, {
								xtype: 'container',
								defaultType: 'checkboxfield',
								hidden: true,
								itemId: 'reportOptionsContainer',
								items: [{
									xtype: 'label',
									text: 'Regions mapping at...'
								}, {
									boxLabel: 'All regions',
									name: this.namePrefix + '_reportRegions',
									inputValue: 'all',
									itemId: 'reportAllRegionsOption',
									checked: true,
									hidden: true
								}, {
									xtype: 'container',
									layout: 'hbox',
									defaultType: 'checkboxfield',
									defaults: {
										hideLabel: false,
										labelAlign: 'top',
										boxLabel: '',
										labelSeparator: "",
										style: 'text-align: center'
									},
									items: [{
										fieldLabel: 'Upstream',
										name: this.namePrefix + '_reportRegions',
										inputValue: 'UPSTREAM',
										labelStyle: 'padding: 2px 3px; font-size:9px; background-color: #E3CEB0;'
									}, {
										fieldLabel: 'Promoter',
										name: this.namePrefix + '_reportRegions',
										inputValue: 'PROMOTER',
										labelStyle: 'padding: 2px 3px; font-size:9px; background-color: #FFF2C0;'
									}, {
										fieldLabel: 'TSS',
										name: this.namePrefix + '_reportRegions',
										inputValue: 'TSS',
										labelAlign: 'top',
										labelStyle: 'padding: 2px 3px; font-size:9px; background-color: #FFF6D3;'
									}, {
										fieldLabel: '1st Exon',
										name: this.namePrefix + '_reportRegions',
										inputValue: '1st_EXON',
										labelStyle: 'padding: 2px 3px; font-size:9px; background-color: #FFC4AD;'
									}, {
										fieldLabel: 'Introns',
										name: this.namePrefix + '_reportRegions',
										inputValue: 'INTRON',
										labelStyle: 'padding: 2px 3px; font-size:9px; background-color: #D0DFF1;'
									}, {
										fieldLabel: 'Gene body',
										name: this.namePrefix + '_reportRegions',
										inputValue: 'GENE_BODY',
										labelStyle: 'padding: 2px 3px; font-size:9px; background-color: #FFE0D3;'
									}, {
										xtype: 'label',
										text: 'Intr.',
										style: 'padding: 5px 3px; font-size:9px; margin-top:4px; background-color: #D0DFF1;'
									}, {
										xtype: 'label',
										text: 'G.B.',
										style: 'padding: 5px 3px; font-size:9px; margin-top:4px;  background-color: #FFE0D3;'
									}, {
										fieldLabel: 'Downstream',
										name: this.namePrefix + '_reportRegions',
										inputValue: 'DOWNSTREAM',
										labelStyle: 'padding: 2px 3px; font-size:9px; background-color: #B2C9E3;'
									}]
								}]
							}]
						},
					]
				}],
				setContent: function(target, values) {
					me.setContent(target, values);
				},
				isValid: function() {
					var valid = true;
					var component = this.queryById("itemsContainerAlt");

					if (!component.isVisible()) {
						component = this.queryById("itemsContainer");
					}
					var items = component.query("field");
					for (var i in items) {
						valid = valid && (this.items[i] || items[i].validate());
					}

					if (component.queryById("mainFileSelector").getValue() === "") {
						valid = false;
						component.queryById("mainFileSelector").markInvalid("Please, provide a Data file.");
					}
					if (component.queryById("tertiaryFileSelector") && component.queryById("tertiaryFileSelector").getValue() === "") {
						valid = false;
						component.queryById("tertiaryFileSelector").markInvalid("Please, provide a GTF file.");
					}

					if (this.queryById("reportOptionsContainer").query("checkboxfield[checked=true]") < 1) {
						valid = false;
						this.queryById("reportOptionsContainer").query("checkboxfield").forEach(function(elem) {
							elem.markInvalid("Please, check at least one gene region.");
						});
					}

					return valid;
				},
				isEmpty: function() {
					var component = this.queryById("itemsContainerAlt");
					if (!component.isVisible()) {
						component = this.queryById("itemsContainer");
					}
					var empty = true;
					if (component.queryById("mainFileSelector").getValue() !== "") {
						empty = false;
					}
					if (component.queryById("tertiaryFileSelector") && component.queryById("tertiaryFileSelector").getValue() !== "") {
						empty = false;
					}

					return empty;
				},
				listeners: {
					boxready: function() {
						initializeTooltips(".helpTip");

						$("#" + me.namePrefix + "_mapRegions").change(function() {
							me.toogleContent();
						});

						$(this.getEl().dom).find("a.deleteOmicBox").click(function() {
							me.removeOmicSubmittingPanel();
						});
					}
				}
			});

			return this.component;
		};

		return this;
	}
	RegionBasedOmicSubmittingPanel.prototype = new View;