/*

    gui.js

    a programming environment
    based on morphic.js, blocks.js, threads.js and objects.js
    inspired by Scratch

    written by Jens Mönig
    jens@moenig.org

    Copyright (C) 2025 by Jens Mönig

    This file is part of Snap!.

    Snap! is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of
    the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.


    prerequisites:
    --------------
    needs blocks.js, threads.js, objects.js, cloud.jus and morphic.js


    toc
    ---
    the following list shows the order in which all constructors are
    defined. Use this list to locate code in this document:

        IDE_Morph
        ProjectDialogMorph
        LibraryImportDialogMorph
        SpriteIconMorph
        TurtleIconMorph
        CostumeIconMorph
        WardrobeMorph
        SoundIconMorph
        JukeboxMorph
        SceneIconMorph
        SceneAlbumMorph
        StageHandleMorph
        PaletteHandleMorph
        CamSnapshotDialogMorph
        SoundRecorderDialogMorph


    credits
    -------
    Nathan Dinsmore contributed saving and loading of projects,
    ypr-Snap! project conversion and countless bugfixes
    Ian Reynolds contributed handling and visualization of sounds
    Michael Ball contributed the LibraryImportDialogMorph and countless
    utilities to load libraries from relative urls
    Bernat Romagosa contributed more things than I can mention,
    including interfacing to the camera and microphone

*/

/*global modules, Morph, SpriteMorph, SyntaxElementMorph, Color, Cloud, Audio,
ListWatcherMorph, TextMorph, newCanvas, useBlurredShadows, Sound, Scene, Note,
StringMorph, Point, MenuMorph, morphicVersion, DialogBoxMorph, BlockEditorMorph,
ToggleButtonMorph, contains, ScrollFrameMorph, StageMorph, PushButtonMorph, sb,
InputFieldMorph, FrameMorph, Process, nop, SnapSerializer, ListMorph, detect,
AlignmentMorph, TabMorph, Costume, MorphicPreferences,BlockMorph, ToggleMorph,
InputSlotDialogMorph, ScriptsMorph, isNil, SymbolMorph, fontHeight, localize,
BlockExportDialogMorph, BlockImportDialogMorph, SnapTranslator, List, ArgMorph,
Uint8Array, HandleMorph, SVG_Costume, TableDialogMorph, CommentMorph, saveAs,
CommandBlockMorph, BooleanSlotMorph, RingReporterSlotMorph, ScriptFocusMorph,
BlockLabelPlaceHolderMorph, SpeechBubbleMorph, XML_Element, WatcherMorph, WHITE,
BlockRemovalDialogMorph,TableMorph, isSnapObject, isRetinaEnabled, SliderMorph,
disableRetinaSupport, enableRetinaSupport, isRetinaSupported, MediaRecorder,
Animation, BoxMorph, BlockDialogMorph, RingMorph, Project, ZERO, BLACK, CLEAR,
BlockVisibilityDialogMorph, ThreadManager, isString, SnapExtensions, snapEquals,
HatBlockMorph*/

/*jshint esversion: 8*/

// Global stuff ////////////////////////////////////////////////////////

modules.gui = '2025-May-05';

// Declarations

var SnapVersion = '10.7.2';

var IDE_Morph;
var ProjectDialogMorph;
var LibraryImportDialogMorph;
var SpriteIconMorph;
var CostumeIconMorph;
var TurtleIconMorph;
var WardrobeMorph;
var SoundIconMorph;
var JukeboxMorph;
var SceneIconMorph;
var SceneAlbumMorph;
var StageHandleMorph;
var PaletteHandleMorph;
var CamSnapshotDialogMorph;
var SoundRecorderDialogMorph;

// IDE_Morph ///////////////////////////////////////////////////////////

// I am SNAP's top-level frame, the Editor window

// IDE_Morph inherits from Morph:

IDE_Morph.prototype = new Morph();
IDE_Morph.prototype.constructor = IDE_Morph;
IDE_Morph.uber = Morph.prototype;

// IDE_Morph preferences settings and skins

IDE_Morph.prototype.isBright = false;

IDE_Morph.prototype.setDefaultDesign = function () { // skeuomorphic
    MorphicPreferences.isFlat = false;
    IDE_Morph.prototype.scriptsPaneTexture = this.scriptsTexture();
    SyntaxElementMorph.prototype.contrast = 65;
};

IDE_Morph.prototype.setFlatDesign = function () {
    MorphicPreferences.isFlat = true;
    IDE_Morph.prototype.scriptsPaneTexture = null;
    SyntaxElementMorph.prototype.contrast = 20;
};

IDE_Morph.prototype.setDefaultTheme = function () { // dark
    IDE_Morph.prototype.isBright = false;

    PushButtonMorph.prototype.outlineColor = new Color(30, 30, 30);
    PushButtonMorph.prototype.outlineGradient = false;

    SpriteMorph.prototype.paletteColor = new Color(30, 30, 30);
    SpriteMorph.prototype.paletteTextColor = new Color(230, 230, 230);
    StageMorph.prototype.paletteTextColor
        = SpriteMorph.prototype.paletteTextColor;
    StageMorph.prototype.paletteColor = SpriteMorph.prototype.paletteColor;
    SpriteMorph.prototype.sliderColor
        = SpriteMorph.prototype.paletteColor.lighter(30);

    IDE_Morph.prototype.buttonContrast = 30;
    IDE_Morph.prototype.backgroundColor = new Color(10, 10, 10);
    IDE_Morph.prototype.frameColor = SpriteMorph.prototype.paletteColor;

    IDE_Morph.prototype.groupColor
        = SpriteMorph.prototype.paletteColor.lighter(5);
    IDE_Morph.prototype.sliderColor = SpriteMorph.prototype.sliderColor;
    IDE_Morph.prototype.buttonLabelColor = WHITE;
    IDE_Morph.prototype.tabColors = [
        IDE_Morph.prototype.groupColor.darker(50),
        IDE_Morph.prototype.groupColor.darker(25),
        IDE_Morph.prototype.groupColor
    ];
    IDE_Morph.prototype.rotationStyleColors = IDE_Morph.prototype.tabColors;
    IDE_Morph.prototype.appModeColor = BLACK;
    IDE_Morph.prototype.padding = 1;

    SpriteIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    CostumeIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    SoundIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    TurtleIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    SceneIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;

    ScriptsMorph.prototype.feedbackColor = WHITE;
};

IDE_Morph.prototype.setBrightTheme = function () {
    IDE_Morph.prototype.isBright = true;

    PushButtonMorph.prototype.outlineColor = new Color(255, 255, 255);
    PushButtonMorph.prototype.outlineGradient = true;

    SpriteMorph.prototype.paletteColor = WHITE;
    SpriteMorph.prototype.paletteTextColor = new Color(70, 70, 70);
    StageMorph.prototype.paletteTextColor
        = SpriteMorph.prototype.paletteTextColor;
    StageMorph.prototype.paletteColor = SpriteMorph.prototype.paletteColor;
    SpriteMorph.prototype.sliderColor = SpriteMorph.prototype.paletteColor;

    IDE_Morph.prototype.buttonContrast = 30;
    IDE_Morph.prototype.backgroundColor = new Color(220, 220, 230);
    IDE_Morph.prototype.frameColor = new Color(240, 240, 245);

    IDE_Morph.prototype.groupColor = WHITE;
    IDE_Morph.prototype.sliderColor = SpriteMorph.prototype.sliderColor;
    IDE_Morph.prototype.buttonLabelColor = new Color(70, 70, 70);
    IDE_Morph.prototype.tabColors = [
        IDE_Morph.prototype.frameColor,
        IDE_Morph.prototype.frameColor.lighter(50),
        IDE_Morph.prototype.groupColor
    ];
    IDE_Morph.prototype.rotationStyleColors = IDE_Morph.prototype.tabColors;
    IDE_Morph.prototype.appModeColor = IDE_Morph.prototype.frameColor;
    IDE_Morph.prototype.padding = 1;

    SpriteIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    CostumeIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    SoundIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    TurtleIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    SceneIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;

    ScriptsMorph.prototype.feedbackColor = new Color(153, 255, 213);
};

IDE_Morph.prototype.scriptsTexture = function () {
    var pic = newCanvas(new Point(100, 100)), // bigger scales faster
        ctx = pic.getContext('2d'),
        i;
    for (i = 0; i < 100; i += 4) {
        ctx.fillStyle = this.frameColor.toString();
        ctx.fillRect(i, 0, 1, 100);
        ctx.fillStyle = this.groupColor.lighter(2).toString();
        ctx.fillRect(i + 1, 0, 1, 100);
        ctx.fillRect(i + 3, 0, 1, 100);
        ctx.fillStyle = this.groupColor.darker(2).toString();
        ctx.fillRect(i + 2, 0, 1, 100);
    }
    return pic;
};

IDE_Morph.prototype.setDefaultTheme();
IDE_Morph.prototype.setDefaultDesign();

// IDE_Morph instance creation:

function IDE_Morph(config = {}) {
    this.init(config);
}

/*
    Configuring the IDE for specialized uses, e.g. as DSL inside another IDE
    can be achieved by passing in an optional configuration dictionary when
    creating an instance. This is still very much under construction. Currently
    the following options are available:

        noAutoFill      bool, do not let the IDE fill the whole World canvas
        path            str, path to additional resources (translations)
        load:           str, microworld file name (xml)
        onload:         callback, called when the microworld is loaded
        design:         str, currently "flat" (bright) or "classic" (dark)
        border:         num, pixels surrounding the IDE, default is none (zero)
        lang:           str, translation to be used, e.g. "de" for German
        mode:           str, currently "presentation" or "edit"
        hideControls:   bool, hide/show the tool bar
        hideCategories: bool, hide/show the palette block category buttons
        hideProjectName:bool, hide/show the project title in the tool bar
        noProjectItems: bood, hide/show project specific menu items
        noDefaultCat:   bool, hide/show the buit-in bloc category buttons
        noSpriteEdits:  bool, hide/show the corral & sprite controls/menus
        noSprites:      bool, hide/show the stage, corral, sprite editor
        noPalette:      bool, hide/show the palette including the categories
        noImports:      bool, disable/allow importing files via drag&drop
        noOwnBlocks:    bool, hider/show "make a block" and "make a category"
        noRingify:      bool, disable/enable "ringify"/"unringify" in ctx menu
        noUserSettings: bool, disable/enable persistent user preferences
        noDevWarning:   bool, ignore development version incompatibility warning
        noExitWarning:  bool, do not show a browser warning when closing the IDE
                                with unsaved changes
        preserveTitle:  bool, do not set the tab title dynamically to reflect
                                the current Snap! version
        blocksZoom:     num, zoom factor for blocks, e.g. 1.5
        blocksFade:     num, fading percentage for blocks, e.g. 85
        zebra:          num, contrast percentage for nesting same-color blocks

    Note that such configurations will not affect the user's own preference
    settings, e.g. configuring the blocks zoom or language will not overwrite
    the user's own settings which are kept in localstorage.
*/

IDE_Morph.prototype.init = function (config) {
    // global font setting
    MorphicPreferences.globalFontFamily = 'Helvetica, Arial';

    // additional properties:
    this.cloud = new Cloud();
    this.cloudMsg = null;
    this.source = null;
    this.serializer = new SnapSerializer();
    this.config = config;
    this.version = Date.now(); // for outside observers

    // restore saved user preferences
    this.userLanguage = null; // user language preference for startup
    this.applySavedSettings();

    // scenes
    this.scenes = new List([new Scene()]);
    this.scene = this.scenes.at(1);
    this.isAddingScenes = false;
    this.isAddingNextScene = false;

    // editor
    this.globalVariables = this.scene.globalVariables;
    this.currentSprite = this.scene.addDefaultSprite();
    this.sprites = this.scene.sprites;
    this.currentCategory = this.scene.unifiedPalette ? 'unified' : 'motion';
    this.currentTab = 'scripts';

    // logoURL is disabled because the image data is hard-copied
    // to avoid tainting the world canvas
    // this.logoURL = this.resourceURL('src', 'snap_logo_sm.png');

    this.logo = null;
    this.controlBar = null;
    this.categories = null;
    this.palette = null;
    this.paletteHandle = null;
    this.spriteBar = null;
    this.spriteEditor = null;
    this.stage = null;
    this.stageHandle = null;
    this.corralBar = null;
    this.corral = null;

    this.embedPlayButton = null;
    this.embedOverlay = null;
    this.isEmbedMode = false;

    this.isAutoFill = !config.noAutoFill;
    this.isAppMode = false;
    this.isSmallStage = false;
    this.filePicker = null;

    // incrementally saving projects to the cloud is currently unused
    // and needs to be extended to work with scenes before reactivation
    this.hasChangedMedia = false;

    this.isAnimating = true;
    this.paletteWidth = 200; // initially same as logo width
    this.stageRatio = 1; // for IDE animations, e.g. when zooming
    this.performerMode = false;

    this.wasSingleStepping = false; // for toggling to and from app mode

    this.loadNewProject = false; // flag when starting up translated
    this.shield = null;

    this.savingPreferences = true; // for bh's infamous "Eisenbergification"

    this.bulkDropInProgress = false; // for handling multiple file-drops
    this.cachedSceneFlag = null; // for importing multiple scenes at once
    this.isImportingLocalFile = false; // for handling imports of smart pics

    // initialize inherited properties:
    IDE_Morph.uber.init.call(this);

    // override inherited properites:
    this.color = this.backgroundColor;

    // initialize the primitive blocks dictionary
    SpriteMorph.prototype.initBlocks();

    // turn all primitives into custom blocks
    // under construction, commented out for now
    // SpriteMorph.prototype.customizeBlocks();
    // this.bootstrapCustomizedPrimitives();
};

IDE_Morph.prototype.openIn = function (world) {
    var hash, myself = this;

    window.onmessage = function (event) {
        // make the API accessible from outside an iframe
        var ide = myself;
        if (!isNil(event.data.selector)) {
            window.top.postMessage(
                {
                    selector: event.data.selector,
                    response: ide[event.data.selector].apply(
                        ide,
                        event.data.params
                    )
                },
                '*'
            );
        }
    };

    function initUser(username) {
        sessionStorage.username = username;
        myself.controlBar.cloudButton.refresh();
        if (username) {
            myself.source = 'cloud';
            if (!myself.cloud.verified) {
                new DialogBoxMorph().inform(
                    'Unverified account',
                    'Your account is still unverified.\n' +
                    'Please use the verification link that\n' +
                    'was sent to your email address when you\n' +
                    'signed up.\n\n' +
                    'If you cannot find that email, please\n' +
                    'check your spam folder. If you still\n' +
                    'cannot find it, please use the "Resend\n' +
                    'Verification Email..." option in the cloud\n' +
                    'menu.',
                    world,
                    myself.cloudIcon(null, new Color(0, 180, 0))
                );
            }
        }
    }

    this.buildPanes();
    world.add(this);
    world.userMenu = this.userMenu;

    // override SnapCloud's user message with Morphic
    this.cloud.message = (string) => {
        var m = new MenuMorph(null, string),
            intervalHandle;
        m.popUpCenteredInWorld(world);
        intervalHandle = setInterval(() => {
            m.destroy();
            clearInterval(intervalHandle);
        }, 2000);
    };

    // prevent non-DialogBoxMorphs from being dropped
    // onto the World in user-mode
    world.reactToDropOf = (morph) => {
        if (!(morph instanceof DialogBoxMorph ||
        		(morph instanceof MenuMorph))) {
            if (world.hand.grabOrigin) {
                morph.slideBackTo(world.hand.grabOrigin);
            } else {
                world.hand.grab(morph);
            }
        }
    };

    this.reactToWorldResize(world.bounds);

    function applyFlags(dict) {
        if (dict.noCloud) {
            myself.cloud.disable();
        }
        if (dict.embedMode) {
            myself.setEmbedMode();
        }
        if (dict.editMode) {
            myself.toggleAppMode(false);
        } else {
            myself.toggleAppMode(true);
        }
        if (!dict.noRun) {
            autoRun();
        }
        if (dict.hideControls) {
            myself.controlBar.hide();
            window.onbeforeunload = nop;
        }
        if (dict.noExitWarning) {
            window.onbeforeunload = window.cachedOnbeforeunload;
        }
        if (dict.blocksZoom) {
            myself.savingPreferences = false;
            myself.setBlocksScale(Math.max(1,Math.min(dict.blocksZoom, 12)));
            myself.savingPreferences = true;
        }

        // only force my world to get focus if I'm not in embed mode
        // to prevent the iFrame from involuntarily scrolling into view
        if (!myself.isEmbedMode) {
            world.worldCanvas.focus();
        }
    }

    function autoRun () {
        // wait until all costumes and sounds are loaded
        if (isLoadingAssets()) {
            myself.world().animations.push(
                new Animation(nop, nop, 0, 200, nop, autoRun)
            );
        } else {
            myself.runScripts();
        }
    }

    function isLoadingAssets() {
        return myself.sprites.asArray().concat([myself.stage]).some(any =>
            (any.costume ? any.costume.loaded !== true : false) ||
            any.costumes.asArray().some(each => each.loaded !== true) ||
            any.sounds.asArray().some(each => each.loaded !== true)
        );
    }

    // dynamic notifications from non-source text files
    // has some issues, commented out for now
    /*
    this.cloudMsg = getURL('https://snap.berkeley.edu/cloudmsg.txt');
    motd = getURL('https://snap.berkeley.edu/motd.txt');
    if (motd) {
        this.inform('Snap!', motd);
    }
    */

    function interpretUrlAnchors() {
        var dict, idx;

        if (location.hash.substr(0, 6) === '#open:') {
            hash = location.hash.substr(6);
            if (hash.charAt(0) === '%'
                    || hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
                hash = decodeURIComponent(hash);
            }
            if (contains(
                    ['project', 'blocks', 'sprites', 'snapdata'].map(each =>
                        hash.substr(0, 8).indexOf(each)
                    ),
                    1
                )) {
                this.droppedText(hash);
            } else if (hash.match(/\.(png|gif|svg|jpe?g|tiff)$/i)) {
                // Import an image, which could contain embedded scripts
                fetch(hash).then(res => res.blob()).then(blob => {
                    let pic = new Image(),
                        imgURL = URL.createObjectURL(blob),
                        dataMarker = MorphicPreferences.pngPayloadMarker;

                    pic.src = imgURL;
                    pic.onload = (async () => {
                        let buff = new Uint8Array(await blob.arrayBuffer()),
                            strBuff = buff.reduce((acc, b) =>
                                acc + String.fromCharCode(b), ""),
                            hasImportanbleCode = (txt) =>
                                txt.match(
                                    /^<(blocks|block|script|sprite)/i
                                ),
                            embeddedData, canvas;

                            if (strBuff.includes(dataMarker)) {
                            embeddedData = decodeURIComponent(
                                strBuff.split(dataMarker)[1]
                            );
                            if (hasImportanbleCode(embeddedData)) {
                                return this.rawOpenScriptString(
                                    embeddedData,
                                    true
                                );
                            }
                        } else {
                            canvas = newCanvas(
                                new Point(pic.width, pic.height),
                                true
                            );
                            canvas.getContext('2d').drawImage(pic, 0, 0);
                            this.droppedImage(canvas, decodeURIComponent(hash));
                        }
                    })();
                });
            } else {
                idx = hash.indexOf("&");
                if (idx > 0) {
                    dict = myself.cloud.parseDict(hash.substr(idx));
                    dict.editMode = true;
                    hash = hash.slice(0, idx);
                    applyFlags(dict);
                }
                this.shield = new Morph();
                this.shield.alpha = 0;
                this.shield.setExtent(this.parent.extent());
                this.parent.add(this.shield);
                this.showMessage('Fetching project...');

                this.getURL(
                    hash,
                    projectData => {
                        var msg;
                        this.nextSteps([
                            () => msg = this.showMessage('Opening project...'),
                            () => {
                                if (projectData.indexOf('<snapdata') === 0) {
                                    this.rawOpenCloudDataString(projectData);
                                } else if (
                                    projectData.indexOf('<project') === 0
                                ) {
                                    this.rawOpenProjectString(projectData);
                                } else if (
                                    projectData.indexOf('<blocks') === 0
                                ) {
                                    this.rawOpenBlocksString(
                                        projectData,
                                        null, // name, optional
                                        true  // silently
                                    );
                                }
                                this.hasChangedMedia = true;
                            },
                            () => {
                                this.shield.destroy();
                                this.shield = null;
                                msg.destroy();
                                this.toggleAppMode(false);
                            }
                        ]);
                    }
                );
            }
       } else if (location.hash.substr(0, 5) === '#run:') {
            dict = '';
            hash = location.hash.substr(5);

            //decoding if hash is an encoded URI
            if (hash.charAt(0) === '%'
                    || hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
                hash = decodeURIComponent(hash);
            }
            idx = hash.indexOf("&");

            // supporting three URL cases

            // xml project
            if (hash.substr(0, 8) === '<project') {
                this.rawOpenProjectString(
                    hash.slice(0,hash.indexOf('</project>') + 10)
                );
                applyFlags(
                    myself.cloud.parseDict(
                        hash.substr(hash.indexOf('</project>') + 10)
                    )
                );
            // no project, only flags
            } else if (idx == 0){
                applyFlags(myself.cloud.parseDict(hash));
            // xml file path
            // three path types allowed:
            //  (1) absolute (http...),
            //  (2) relative to site ("/path") or
            //  (3) relative to folder ("path")
            } else {
                this.shield = new Morph();
                this.shield.alpha = 0;
                this.shield.setExtent(this.parent.extent());
                this.parent.add(this.shield);
                this.showMessage('Fetching project...');
                if (idx > 0) {
                    dict = myself.cloud.parseDict(hash.substr(idx));
                    hash = hash.slice(0,idx);
                }
                this.getURL(
                    hash,
                    projectData => {
                        var msg;
                        this.nextSteps([
                            () => msg = this.showMessage('Opening project...'),
                            () => {
                                if (projectData.indexOf('<snapdata') === 0) {
                                    this.rawOpenCloudDataString(projectData);
                                } else if (
                                    projectData.indexOf('<project') === 0
                                ) {
                                    this.rawOpenProjectString(projectData);
                                }
                                this.hasChangedMedia = true;
                            },
                            () => {
                                this.shield.destroy();
                                this.shield = null;
                                msg.destroy();
                                // this.toggleAppMode(true);
                                applyFlags(dict);
                            }
                        ]);
                    }
                );
            }
        } else if (location.hash.substr(0, 9) === '#present:') {
            this.shield = new Morph();
            this.shield.color = this.color;
            this.shield.setExtent(this.parent.extent());
            this.parent.add(this.shield);
            myself.showMessage('Fetching project\nfrom the cloud...');

            // make sure to lowercase the username
            dict = myself.cloud.parseDict(location.hash.substr(9));
            dict.Username = dict.Username.toLowerCase();

            myself.cloud.getPublicProject(
                dict.ProjectName,
                dict.Username,
                projectData => {
                    var msg;
                    myself.nextSteps([
                        () => msg = myself.showMessage('Opening project...'),
                        () => {
                            if (projectData.indexOf('<snapdata') === 0) {
                                myself.rawOpenCloudDataString(projectData);
                            } else if (
                                projectData.indexOf('<project') === 0
                            ) {
                                myself.rawOpenProjectString(projectData);
                            }
                            myself.hasChangedMedia = true;
                        },
                        () => {
                            myself.shield.destroy();
                            myself.shield = null;
                            msg.destroy();
                            applyFlags(dict);
                        }
                    ]);
                },
                this.cloudError()
            );
        } else if (location.hash.substr(0, 7) === '#cloud:') {
            this.shield = new Morph();
            this.shield.alpha = 0;
            this.shield.setExtent(this.parent.extent());
            this.parent.add(this.shield);
            myself.showMessage('Fetching project\nfrom the cloud...');

            // make sure to lowercase the username
            dict = myself.cloud.parseDict(location.hash.substr(7));

            myself.cloud.getPublicProject(
                dict.ProjectName,
                dict.Username,
                projectData => {
                    var msg;
                    myself.nextSteps([
                        () => msg = myself.showMessage('Opening project...'),
                        () => {
                            if (projectData.indexOf('<snapdata') === 0) {
                                myself.rawOpenCloudDataString(projectData);
                            } else if (
                                projectData.indexOf('<project') === 0
                            ) {
                                myself.rawOpenProjectString(projectData);
                            }
                            myself.hasChangedMedia = true;
                        },
                        () => {
                            myself.shield.destroy();
                            myself.shield = null;
                            msg.destroy();
                            myself.toggleAppMode(false);
                        }
                    ]);
                },
                this.cloudError()
            );
        } else if (location.hash.substr(0, 4) === '#dl:') {
            myself.showMessage('Fetching project\nfrom the cloud...');

            // make sure to lowercase the username
            dict = myself.cloud.parseDict(location.hash.substr(4));
            dict.Username = dict.Username.toLowerCase();

            myself.cloud.getPublicProject(
                dict.ProjectName,
                dict.Username,
                projectData => {
                	myself.saveXMLAs(projectData, dict.ProjectName);
                 	myself.showMessage(
                  	   'Saved project\n' + dict.ProjectName,
                      	2
                 	);
                },
                this.cloudError()
            );
        } else if (location.hash.substr(0, 6) === '#lang:') {
            dict = myself.cloud.parseDict(location.hash.substr(6));
            applyFlags(dict);
        } else if (location.hash.substr(0, 7) === '#signup') {
            this.createCloudAccount();
        }
        this.loadNewProject = false;
    }

    function launcherLangSetting() {
        var langSetting = null;
        if (location.hash.substr(0, 6) === '#lang:') {
            if (location.hash.charAt(8) === '_') {
                langSetting = location.hash.slice(6,11);
            } else {
                langSetting = location.hash.slice(6,8);
            }
        }
        // lang-flag wins lang-anchor setting
        langSetting = myself.cloud.parseDict(location.hash).lang || langSetting;
        return langSetting;
    }

    if (launcherLangSetting()) {
        // launch with this non-persisten lang setting
        this.loadNewProject = true;
        this.setLanguage(launcherLangSetting(), interpretUrlAnchors, true);
    } else if (this.userLanguage) {
        this.loadNewProject = true;
        this.setLanguage(this.userLanguage, interpretUrlAnchors);
    } else {
        interpretUrlAnchors.call(this);
    }

    if (location.protocol === 'file:') {
        Process.prototype.enableJS = true;
    } else {
        if (!sessionStorage.username) {
            // check whether login should persist across browser sessions
            this.cloud.initSession(initUser);
        } else {
            // login only persistent during a single browser session
            this.cloud.checkCredentials(initUser);
        }
    }

    world.keyboardFocus = this.stage;
    this.warnAboutIE();

    // configure optional settings
    this.applyConfigurations();

    this.warnAboutDev();
    return this;
};

// IDE_Morph configuration

IDE_Morph.prototype.applyConfigurations = function () {
    var cnf = this.config,
        refreshLater = false,
        lang, translation, src,

        refresh = () => {
            // load project
            if (cnf.load) {
                this.getURL(
                    cnf.load,
                    projectData => {
                        if (projectData.indexOf('<snapdata') === 0) {
                            this.rawOpenCloudDataString(projectData);
                        } else if (
                            projectData.indexOf('<project') === 0
                        ) {
                            this.rawOpenProjectString(projectData);
                        }
                        this.hasChangedMedia = true;
                        this.applyPaneHidingConfigurations();
                        if (cnf.onload) {
                            cnf.onload();
                        }
                    }
                );
            } else {
                this.buildPanes();
                this.fixLayout();
                this.newProject();
                this.applyPaneHidingConfigurations();
            }
        };

    if (!Object.keys(cnf).length) {
        return;
    }

    // design
    if (cnf.design) {
        if (cnf.design === 'flat') {
            this.setFlatDesign();
        } else if (cnf.design === 'classic') {
            this.setDefaultDesign();
        }
    }

    // theme
    if (cnf.theme) {
        if (cnf.theme === 'bright') {
            this.setBrightTheme();
        } else if (cnf.theme === 'dark') {
            this.setDefaultTheme();
        }
    }

    // interaction mode
    if (cnf.mode === "presentation") {
        this.toggleAppMode(true);
    } else {
        this.toggleAppMode(false);
    }

    // blocks size
    if (cnf.blocksZoom) {
        SyntaxElementMorph.prototype.setScale(
            Math.max(1, Math.min(cnf.blocksZoom, 12))
        );
        CommentMorph.prototype.refreshScale();
    }

    // blocks fade
    if (cnf.blocksFade) {
        SyntaxElementMorph.prototype.setAlphaScaled(100 - cnf.blocksFade);
    }

    // zebra coloring //
    if (isNil(cnf.zebra)) {
        BlockMorph.prototype.zebraContrast = 40;
    } else {
        BlockMorph.prototype.zebraContrast = cnf.zebra;
    }

    // language
    if (cnf.lang) {
        lang = cnf.lang;
        translation = document.getElementById('language');

        // this needs to be directed to something more generic:
        src = this.resourceURL('locale', 'lang-' + lang + '.js');

        SnapTranslator.unload();
        if (translation) {
            document.head.removeChild(translation);
        }
        SnapTranslator.language = lang;
        if (lang !== 'en') {
            refreshLater = true;
            translation = document.createElement('script');
            translation.id = 'language';
            translation.onload = () => refresh();
            document.head.appendChild(translation);
            translation.src = src;
        }
    }

    // no palette
    if (cnf.noPalette) {
        ScriptsMorph.prototype.enableKeyboard = false;
    }

    if (!refreshLater) {
        refresh();
    }

    // disable cloud access
    if (cnf.noCloud) {
        this.cloud.disable();
        this.fixLayout();
    }

    // disable onbeforeunload close warning
    if (cnf.noExitWarning) {
        window.onbeforeunload = window.cachedOnbeforeunload;
    }
};

IDE_Morph.prototype.applyPaneHidingConfigurations = function () {
    var cnf = this.config;

    // hide controls
    if (cnf.hideControls) {
        this.logo.hide();
        this.controlBar.hide();
        window.onbeforeunload = nop;
    }

    // hide categories
    if (cnf.hideCategories) {
        this.categories.hide();
    }

    // no sprites
    if (cnf.noSprites) {
        this.stage.hide();
        cnf.noSpriteEdits = true;
    }

    // hide sprite editing widgets
    if (cnf.noSpriteEdits) {
        this.spriteBar.hide();
        this.stageHandle.hide();
        this.corralBar.hide();
        this.corral.hide();
    }

    // no palette
    if (cnf.noPalette) {
        this.categories.hide();
        this.palette.hide();
        this.paletteHandle.hide();
    }
};

// IDE_Morph construction

IDE_Morph.prototype.buildPanes = function () {
    this.createLogo();
    this.createControlBar();
    this.createCategories();
    this.createPalette();
    this.createStage();
    this.createSpriteBar();
    this.createSpriteEditor();
    this.createCorralBar();
    this.createCorral();
};

IDE_Morph.prototype.createLogo = function () {
    var myself = this;

    if (this.logo) {
        this.logo.destroy();
    }

    this.logo = new Morph();

    // the logo texture is not loaded dynamically as an image, but instead
    // hard-copied here to avoid tainting the world canvas. This lets us
    // use Snap's (and Morphic's) color pickers to sense any pixel which
    // otherwise would be compromised by annoying browser security.

    // this.logo.texture = this.logoURL; // original code, commented out
    this.logo.texture = "data:image/png;base64," +
        "iVBORw0KGgoAAAANSUhEUgAAACwAAAAYCAYAAACBbx+6AAAKiklEQVRYR5VXe3BU5RX/" +
        "ne+7924SwiOEJJvwUCAgCZFBEtRatIlVlATLIwlFsCgdeYWICu1MfbKUabVVtBoDQlUc" +
        "FCubEIpAAEUTrGhFGIXAAjZCFdhNQiTkQbK7997vdO7SREAo9P5zZ77HOb9zzu87D8JV" +
        "fOyBwGIwEdg5XrcmKRExcoSCNQKgWwXRTYKQDAKUQi1DbASrjzgsdqdM8zc6d6o80LIB" +
        "RR6oq1B52SN0pcteL+SUKbCdcw3lCUMsof2amAs0iVRNEoIhZYKoCcTtYBARxUUZ1IMZ" +
        "CIZxWDG9oVSv1/tP8Z12ZHAVNMqBdSW9l9uPAGYGoQwicqjQUQsmZ9kLSf8FGyhzzyCB" +
        "P8X1kO7TLaoREJuIxCeSzKNhWzRbKhgyRCwJZfcA2UOY+E4QTewZK2Ob2tQhIl6cPLmu" +
        "LKLPC+n8O2X/P+CJAXLAXXzpfLD+sqRHesaKF5vbHZtil4bCA98YeO+2f19J0Yl3+wzV" +
        "DH0GMz8cE0WxHSH8DZrxhPsX3x7rBO5YUFgI1Um3y8r0sCg8WOZgBQ54YPTJGNCPgehw" +
        "qNl/zfTmJoe3Dt9OeN15LgObTUs/JNB9prvA9/mljNvblCkyh+7l6p3AxVxt2JiQalty" +
        "IYB5AL5n5qWh1vqVA2cieCWjz+07AXd8C+eZAP71SY8Q6JlzfuajDPFMSkHg7brtSd1w" +
        "Vr2hVIymxX97f2IO2nCPP2be0EDaWZuMVttoP2tGBd5/dfCpToHnKMZUvWSJzP5ZNSin" +
        "uouv9RXX/MRW9lMgHkekaqCsVZDmZnfD4JMI7LXPPUgHXATaBVEvLDrg7tBgRDbrK9wz" +
        "GHwnM0Xrmsg3bT4eC5XV2FzfYnS/fkzK9zU7aQ7MXxbvnxkk8UhYUTcGTGJyMsM/Okw5" +
        "s3rVdY2Zs/foe1MyIw8UHjA8oCosEUA1cjw/AA94M/KUMOcQBW8gsptYuXYpa8Cr/aZW" +
        "7Sss9Mrhw33swWJkV1eL6uoc6wFPVVRDo3stmDN/xOFAed95EHYps7o/Jb/hrc6QTXt0" +
        "/4QzYa1Egd7TyCq3WEgBGkggMyGhbt2bnpyrDO8PJDizAYPbbS21Tw+rXk+BjzIQvhRF" +
        "8ub6MlhiF4h6dKU1J1M4xD+xvnc/CaMKpN5LntywqHM9d77vrwCNrCxNG32x0Oxs1lzp" +
        "vmtdQVnfe0DArGvsczNskUAaareWDP/SOT+2qKa/DkrtLu14k8HrW+JrsKbf1xFZN3ES" +
        "khrbJ7tPxYYMMRpsxQi4ajaVDjnobI8vrslWLLc6186lNYBqX041hiyoDR339ovWNGs7" +
        "GA3J+XUFneDGFft+T4zfCsYDm5enrzsfdF7R12lM1jsAfcPgNmJkMqE3AfEMWqYTlVpK" +
        "vcDAbSCcEUCcIO6jSyzWSW04a8rXmGAw4yQYg5nQkxi9GHhu6/L0pbnzfbcxoZIUFXd5" +
        "2KlEOR5Yfm/cACFduxnCl5zvv70TWN68/YNYauVSi77BNjs2CmDVQKF/WFIyJPTzh48m" +
        "GVbwCwK6E+MJJtpBLKUi+1kC3wNShbaF40KDrkM7FrQ0S5PmsyCMd5xAzHMVYRgzzbCV" +
        "/jkb4Z66En/WpGuisjryFIkGsFqrWN0XAXx+NQuUpyyJ70VPnz5jfapc7RNS7mltXLly" +
        "tj5nzipzbPG+gTrrTzIwQ2guTZmhHUoXxdteGnYkd/6hfUR8cMsr6dM6jcwt+nokkbkL" +
        "JBdseWXY6+dH5a6iw3dLUiuYsQJEPwXQurU07b7OM3c9ery3DLceAdHHgvl1xVQYIvzG" +
        "AUzshXCqTsP65NtsxioQWgAVw2w/kFLQuGfPykw9a84eqzPV3D2vZgQJ7UEp9YfYDtXa" +
        "mhwvLHs5QTRvKU2b3AW4+ND1YOwQQi3cXDJ8be78QwsZGCXAUgFDCdRPET8uGGMBiqlM" +
        "WDcBHo9yMkVZ2RQ7d75vEzMGMMmFUqqO0b2H/dMBGym/zBB1Fe6PwBAgvAxgBYMWpuQH" +
        "3nLq/5KdrA42f+Y69WXIdFKNA2pcsW+iYLzDjBIQZwHUWlmaNqnTsNzimiywtoFhL2PI" +
        "YQTOZfDbAH1B4CwCTSfiJxXTHQTun5gQk/emZ2Aw3XPA8HkywuOKfZXElFJZmjYykik9" +
        "LLrSWl1F0iyXIVaFgmqa5rI+NsO680LXJufXzedIo3ZhIv/Bi75qAvwMpEChrnJ52r1d" +
        "kSg6MlqStYZBxwFKZ4XpW1ek7XTuTiiq6W+SfA/Ez4FxB0EkbylNG3fem4ljoR1hoFLY" +
        "eJ50Kdtq/AcjHG7cFN/XDOu7AWpOzg+kH/DCiJdJXzFLocX7s5wK9+CivZnfne3WM0rD" +
        "4ZYwhWO7dbjskD6VSPwOij1MmE2E+srS9LFdmWXu4dtJU2VgOgxgqFDqKc0V827YDCaC" +
        "uIgYs1hxMQTdAubbFctJ21YM2z95ti85aGA5gFGsuISIHgNwshurWyKAAxXJy7q5sLA1" +
        "qGb1za9/zVnzlyeu6h7TbdbZjmNT3flYN3XBvj+22noRA8cY6CBCFJgSFdQaM6ReMlyi" +
        "nEDHKkvTZ3R5f77vTmIuZYlXSNEoEPKZcRiMehAsJ4URsEIJSiPmOQT+EKAWJhoEcIKm" +
        "xFxbKottVICwrrI0fTY5Pa5N8iunh2i3w2MGT2lqdhTWlSWNj4kxNp0Nth8Qoe/vSCph" +
        "c2rWgYk2EE8gYZNqs1l88feSjN0RPj908AZlo3X78uG1nYBnPHYoHh0dQweh+ZCzdgjx" +
        "eU5B0Q0+2MduOtAsY+Paw3qo1daeAXFSFJnLJIm+LIi6a+Hq1ctG+bwvfBq97pueg4TR" +
        "42jZi/07KFDh9ib20gpPnbH/4J4ceHLPSuhZc2AeW31tVFT34Fp3ojE50Gi9n5zqn0oj" +
        "0HSp0nmpNY/HIzwez1VNF+OLD35gM4W3lqbn/W/5TBRYn7iISPaxFXn7Fvi/9Hgg0tNB" +
        "zpRR571mIMtgSbcokXe2PcavKLaCYR4DFBT1qvWfnFZ984IFLU4rugRVoroaqKrKsZ0e" +
        "0OmxT3qzrlOC7pZojmbWmcggWylACNh2nBYb9VG4LTy9ZuqOJY/31my9dMziF3vGvDug" +
        "pSPb0GWzBdkEwWSdbs/aOPxXZZHIXTAidTbzzj9Srwns35QSgzDfJdjKBon+DM1m5gwi" +
        "dAjhL0yahG/+VZnqSt1dazoC9yZDZs6G5dwNbEhcBIXHAdpFZCu2NQ0kmahdWZyoubQj" +
        "aLMmbc/Z9pdR6a4Qv5bzYK2ufTwmZGUoTXxnsooxGByWetPTSRPC+yN9zeVC4OBd4gF5" +
        "zhsanUY/w4PwiQ19R0plvQWmpckFdd7Lyagrd29i4Nvkgrpix/DTHaboHa1HaCKMDFLh" +
        "9/lIo0c9/dmUOKkpXj36+TOuPm+KU8ZYSggfYGHYpMKSP+nwhzrnSnLCWZYOutyYEpm/" +
        "fOCLp9268uQXQOpGZnKKTBtLinaYAgJJojZWfCsDBSTlFPfEEzVXy/3/5UCHZlecmh0B" +
        "jrfLvBAJPlC/G1PlkNza0OkP4noGW4zVhkaTTAsWsTNnkDP02XSu82oTTPOSCgJvOw85" +
        "0xE09MezY9mpQp7i87IHwOJ0IiRcSNOIAdkRmZEJ5D9/VBCtnsd7nAAAAABJRU5ErkJg" +
        "gg==";

    this.logo.render = function (ctx) {
        var gradient = ctx.createLinearGradient(
                0,
                0,
                this.width(),
                0
            );
        gradient.addColorStop(0, 'black');
        gradient.addColorStop(0.5, myself.frameColor.toString());
        ctx.fillStyle = MorphicPreferences.isFlat ||
                IDE_Morph.prototype.isBright ?
            myself.frameColor.toString() : gradient;
        ctx.fillRect(0, 0, this.width(), this.height());
        if (this.cachedTexture) {
            this.renderCachedTexture(ctx);
        } else if (this.texture) {
            this.renderTexture(this.texture, ctx);
        }
    };

    this.logo.renderCachedTexture = function (ctx) {
        ctx.drawImage(
            this.cachedTexture,
            5,
            Math.round((this.height() - this.cachedTexture.height) / 2)
        );
        this.changed();
    };

    this.logo.mouseClickLeft = function () {
        myself.snapMenu();
    };

    this.logo.color = BLACK;
    this.logo.setExtent(new Point(200, 28)); // dimensions are fixed
    this.add(this.logo);
};

IDE_Morph.prototype.createControlBar = function () {
    // assumes the logo has already been created
    var padding = 5,
        button,
        slider,
        stopButton,
        pauseButton,
        startButton,
        projectButton,
        settingsButton,
        stageSizeButton,
        appModeButton,
        steppingButton,
        cloudButton,
        x,
        colors = this.isBright ? this.tabColors
        : [
            this.groupColor,
            this.frameColor.darker(50),
            this.frameColor.darker(50)
        ],
        activeColor = new Color(153, 255, 213),
        activeColors = [
            activeColor,
            activeColor.lighter(40),
            activeColor.lighter(40)
        ],
        myself = this;

    if (this.controlBar) {
        this.controlBar.destroy();
    }

    this.controlBar = new Morph();
    this.controlBar.color = this.frameColor;
    this.controlBar.setHeight(this.logo.height()); // height is fixed

    // let users manually enforce re-layout when changing orientation
    // on mobile devices
    // Leaving it out, because it's most probably unneeded
    /*
    this.controlBar.mouseClickLeft = function () {
        this.world().fillPage();
    };
    */

    this.add(this.controlBar);

    //smallStageButton
    button = new ToggleButtonMorph(
        null, //colors,
        this, // the IDE is the target
        'toggleStageSize',
        [
            new SymbolMorph('smallStage', 14),
            new SymbolMorph('normalStage', 14)
        ],
        () => this.isSmallStage // query
    );

    button.hasNeutralBackground = true;
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[0];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.isBright ?
        WHITE
        : this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    // button.hint = 'stage size\nsmall & normal';
    button.fixLayout();
    button.refresh();
    stageSizeButton = button;
    this.controlBar.add(stageSizeButton);
    this.controlBar.stageSizeButton = button; // for refreshing

    //appModeButton
    button = new ToggleButtonMorph(
        null, //colors,
        this, // the IDE is the target
        'toggleAppMode',
        [
            new SymbolMorph('fullScreen', 14),
            new SymbolMorph('normalScreen', 14)
        ],
        () => this.isAppMode // query
    );

    button.hasNeutralBackground = true;
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[0];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    // button.hint = 'app & edit\nmodes';
    button.fixLayout();
    button.refresh();
    appModeButton = button;
    this.controlBar.add(appModeButton);
    this.controlBar.appModeButton = appModeButton; // for refreshing

    //steppingButton
    button = new ToggleButtonMorph(
        null, //colors,
        this, // the IDE is the target
        'toggleSingleStepping',
        [
            new SymbolMorph('footprints', 16),
            new SymbolMorph('footprints', 16)
        ],
        () => Process.prototype.enableSingleStepping // query
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = activeColor;
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.hint = 'Visible stepping';
    button.fixLayout();
    button.refresh();
    steppingButton = button;
    this.controlBar.add(steppingButton);
    this.controlBar.steppingButton = steppingButton; // for refreshing

    if (this.performerMode) {
        appModeButton.hide();
        stageSizeButton.hide();
    }

    // stopButton
    button = new ToggleButtonMorph(
        null, // colors
        this, // the IDE is the target
        'stopAllScripts',
        [
            new SymbolMorph('octagon', 14),
            new SymbolMorph('square', 14)
        ],
        () => this.stage ? // query
                myself.stage.enableCustomHatBlocks &&
                    myself.stage.threads.pauseCustomHatBlocks
            : true
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(
        this.isBright ? 128 : 200,
        0,
        0
    );
    button.contrast = this.buttonContrast;
    // button.hint = 'stop\nevery-\nthing';
    button.fixLayout();
    button.refresh();
    stopButton = button;
    this.controlBar.add(stopButton);
    this.controlBar.stopButton = stopButton; // for refreshing

    //pauseButton
    button = new ToggleButtonMorph(
        null, //colors,
        this, // the IDE is the target
        'togglePauseResume',
        [
            new SymbolMorph('pause', 12),
            new SymbolMorph('pointRight', 14)
        ],
        () => this.isPaused() // query
    );

    button.hasNeutralBackground = true;
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[0];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.isBright ?
        new Color(220, 185, 0)
            : new Color(255, 220, 0);
    button.contrast = this.buttonContrast;
    // button.hint = 'pause/resume\nall scripts';
    button.fixLayout();
    button.refresh();
    pauseButton = button;
    this.controlBar.add(pauseButton);
    this.controlBar.pauseButton = pauseButton; // for refreshing

    // startButton
    button = new PushButtonMorph(
        this,
        'pressStart',
        new SymbolMorph('flag', 14)
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.fps = 4;
    button.isActive = false;

    button.step = function () {
        var isRunning;
        if (!myself.stage) {
            return;
        }
        isRunning = !!myself.stage.threads.processes.length;
        if (isRunning === this.isActive) {
            return;
        }
        this.isActive = isRunning;
        if (isRunning) {
            this.color = activeColors[0];
            this.highlightColor = activeColors[1];
            this.pressColor = activeColors[2];
        } else {
            this.color = colors[0];
            this.highlightColor = colors[1];
            this.pressColor = colors[2];
        }
        this.rerender();
    };

    button.labelColor = new Color(
        0,
        this.isBright ? 100 : 200,
        0
    );
    button.contrast = this.buttonContrast;
    // button.hint = 'start green\nflag scripts';
    button.fixLayout();
    startButton = button;
    this.controlBar.add(startButton);
    this.controlBar.startButton = startButton;

    // steppingSlider
    slider = new SliderMorph(
        61,
        1,
        Process.prototype.flashTime * 100 + 1,
        6,
        'horizontal'
    );
    slider.action = (num) => {
        Process.prototype.flashTime = (num - 1) / 100;
        this.controlBar.refreshResumeSymbol();
    };
    // slider.alpha = MorphicPreferences.isFlat ? 0.1 : 0.3;
    slider.color = activeColor;
    slider.alpha = 0.3;
    slider.setExtent(new Point(50, 14));
    this.controlBar.add(slider);
    this.controlBar.steppingSlider = slider;

    // projectButton
    button = new PushButtonMorph(
        this,
        'projectMenu',
        new SymbolMorph('file', 14)
        //'\u270E'
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    // button.hint = 'open, save, & annotate project';
    button.fixLayout();
    projectButton = button;
    this.controlBar.add(projectButton);
    this.controlBar.projectButton = projectButton; // for menu positioning

    // settingsButton
    button = new PushButtonMorph(
        this,
        'settingsMenu',
        new SymbolMorph('gears', 14)
        //'\u2699'
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    // button.hint = 'edit settings';
    button.fixLayout();
    settingsButton = button;
    this.controlBar.add(settingsButton);
    this.controlBar.settingsButton = settingsButton; // for menu positioning

    // cloudButton
    button = new ToggleButtonMorph(
        null, //colors,
        this, // the IDE is the target
        'cloudMenu',
        [
            new SymbolMorph('cloudOutline', 11),
            new SymbolMorph('cloud', 11)
        ],
        () => !isNil(this.cloud.username) // query
    );

    button.hasNeutralBackground = true;
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[0];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    // button.hint = 'cloud operations';
    button.fixLayout();
    button.refresh();
    cloudButton = button;
    this.controlBar.add(cloudButton);
    this.controlBar.cloudButton = cloudButton; // for menu positioning & refresh

    this.controlBar.fixLayout = function () {
        x = this.right() - padding;
        [stopButton, pauseButton, startButton].forEach(button => {
                button.setCenter(myself.controlBar.center());
                button.setRight(x);
                x -= button.width();
                x -= padding;
            }
        );

        x = startButton.left() - (3 * padding + 2 * stageSizeButton.width());
        if (!myself.config.noSprites) {
            x = Math.min(
                x,
                myself.right() - myself.stage.dimensions.x *
                    (myself.isSmallStage ? myself.stageRatio : 1) -
                    (myself.config.border || 0)
            );
            x = Math.max(x, this.left());
        }
        [stageSizeButton, appModeButton].forEach(button => {
                x += padding;
                button.setCenter(myself.controlBar.center());
                button.setLeft(x);
                x += button.width();
            }
        );

        slider.setCenter(myself.controlBar.center());
        if (myself.performerMode) {
            slider.setRight(startButton.left() - padding);
        } else {
            slider.setRight(stageSizeButton.left() - padding);
        }

        steppingButton.setCenter(myself.controlBar.center());
        steppingButton.setRight(slider.left() - padding);

        settingsButton.setCenter(myself.controlBar.center());
        settingsButton.setLeft(this.left());

        if (myself.config.hideSettings) {
            settingsButton.hide();
        }

        projectButton.setCenter(myself.controlBar.center());

        if (myself.config.noImports || myself.config.hideProjects) {
            projectButton.hide();
        }

        if (myself.cloud.disabled) {
            cloudButton.hide();
            projectButton.setRight(settingsButton.left() - padding);
        } else {
            cloudButton.setCenter(myself.controlBar.center());
            cloudButton.setRight(settingsButton.left() - padding);
            projectButton.setRight(cloudButton.left() - padding);
        }

        this.refreshSlider();
        this.updateLabel();
    };

    this.controlBar.refreshSlider = function () {
        if (Process.prototype.enableSingleStepping && !myself.isAppMode) {
            slider.fixLayout();
            slider.rerender();
            slider.show();
        } else {
            slider.hide();
        }
        this.refreshResumeSymbol();
    };

    this.controlBar.refreshResumeSymbol = function () {
        var pauseSymbols;
        if (Process.prototype.enableSingleStepping &&
                Process.prototype.flashTime > 0.5) {
            myself.stage.threads.pauseAll(myself.stage);
            pauseSymbols = [
                new SymbolMorph('pause', 12),
                new SymbolMorph('stepForward', 14)
            ];
        } else {
            pauseSymbols = [
                new SymbolMorph('pause', 12),
                new SymbolMorph('pointRight', 14)
            ];
        }
        pauseButton.labelString = pauseSymbols;
        pauseButton.createLabel();
        pauseButton.fixLayout();
        pauseButton.refresh();
    };

    this.controlBar.updateLabel = function () {
        var prefix = myself.hasUnsavedEdits() ? '\u270E ' : '',
            suffix = myself.world().isDevMode ?
                ' - ' + localize('development mode') : '',
            name, scene, txt;

        if (this.label) {
            this.label.destroy();
        }
        if (myself.isAppMode || myself.config.hideProjectName) {
            return;
        }
        scene = myself.scenes.at(1) !== myself.scene ?
                ' (' + myself.scene.name + ')' : '';
        name = (myself.getProjectName() || localize('untitled'));
        if (!myself.config.preserveTitle) {
            document.title = "Snap! " +
                (myself.getProjectName() ? name : SnapVersion);
        }
        txt = new StringMorph(
            prefix + name +  scene + suffix,
            14,
            'sans-serif',
            true,
            false,
            false,
            IDE_Morph.prototype.isBright ? null : new Point(2, 1),
            myself.frameColor.darker(myself.buttonContrast)
        );
        txt.color = myself.buttonLabelColor;

        this.label = new FrameMorph();
        this.label.acceptsDrops = false;
        this.label.alpha = 0;
        txt.setPosition(this.label.position());
        this.label.add(txt);
        this.label.setExtent(
            new Point(
                steppingButton.left() - settingsButton.right() - padding * 2,
                txt.height()
            )
        );
        this.label.setCenter(this.center());
        this.label.setLeft(this.settingsButton.right() + padding);
        this.add(this.label);
    };
};

IDE_Morph.prototype.createCategories = function () {
    var myself = this,
        categorySelectionAction = this.scene.unifiedPalette ? scrollToCategory
            : changePalette,
        categoryQueryAction = this.scene.unifiedPalette ? queryTopCategory
            : queryCurrentCategory,
        shift = this.config.noDefaultCat ? 4 : 0,
        flag = true;

    if (this.categories) {
        flag = this.categories.isVisible;
        this.categories.destroy();
    }
    this.categories = new Morph();
    this.categories.color = this.groupColor;
    this.categories.bounds.setWidth(this.paletteWidth);
    this.categories.buttons = [];
    this.categories.isVisible = flag;

    this.categories.droppedImage = (aCanvas, name, embeddedData) => {
        this.droppedImage(aCanvas, name, embeddedData, 'categories');
    };

    this.categories.refresh = function () {
        this.buttons.forEach(cat => {
            cat.refresh();
            if (cat.state) {
                cat.scrollIntoView();
            }
        });
    };

    this.categories.refreshEmpty = function () {
        var dict = myself.currentSprite.emptyCategories();
        dict.variables = dict.variables || dict.lists || dict.other;
        this.buttons.forEach(cat => {
            if (Object.hasOwn(dict, cat.category) && (dict[cat.category])) {
                cat.enable();
            } else {
                cat.disable();
            }
        });
    };

    function changePalette(category) {
        return () => {
            myself.currentCategory = category;
            myself.categories.buttons.forEach(each =>
                each.refresh()
            );
            myself.refreshPalette(true);
        };
    }

    function scrollToCategory(category) {
        return () => myself.scrollPaletteToCategory(category);
    }

    function queryCurrentCategory(category) {
        return () => myself.currentCategory === category;
    }

    function queryTopCategory(category) {
        return () => myself.topVisibleCategoryInPalette() === category;
    }

    function addCategoryButton(category) {
        var labelWidth = 75,
            colors = [
                myself.frameColor,
                myself.frameColor.darker(IDE_Morph.prototype.isBright ? 5 : 50),
                SpriteMorph.prototype.blockColor[category]
            ],
            button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            categorySelectionAction(category),
            category[0].toUpperCase().concat(category.slice(1)), // label
            categoryQueryAction(category), // query
            null, // env
            null, // hint
            labelWidth, // minWidth
            true // has preview
        );

        button.category = category;
        button.corner = 8;
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = IDE_Morph.prototype.isBright ?
            CLEAR : colors[1];
        button.labelColor = myself.buttonLabelColor;
        if (IDE_Morph.prototype.isBright) {
            button.labelPressColor = WHITE;
        }
        button.fixLayout();
        button.refresh();
        myself.categories.add(button);
        myself.categories.buttons.push(button);
        return button;
    }

    function addCustomCategoryButton(category, color) {
        var labelWidth = 168,
            colors = [
                myself.frameColor,
                myself.frameColor.darker(IDE_Morph.prototype.isBright ? 5 : 50),
                color
            ],
            button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            categorySelectionAction(category),
            category, // label
            categoryQueryAction(category), // query
            null, // env
            null, // hint
            labelWidth, // minWidth
            true // has preview
        );

        button.category = category;
        button.corner = 8;
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = IDE_Morph.prototype.isBright ?
            CLEAR : colors[1];
        button.labelColor = myself.buttonLabelColor;
        if (IDE_Morph.prototype.isBright) {
            button.labelPressColor = WHITE;
        }
        button.fixLayout();
        button.refresh();
        myself.categories.add(button);
        myself.categories.buttons.push(button);
        return button;
    }

    function fixCategoriesLayout() {
        var buttonWidth = myself.categories.children[0].width(),
            buttonHeight = myself.categories.children[0].height(),
            more = SpriteMorph.prototype.customCategories.size,
            border = 3,
            xPadding = (200 // myself.logo.width()
                - border
                - buttonWidth * 2) / 3,
            yPadding = 2,
            l = myself.categories.left(),
            t = myself.categories.top(),
            scroller,
            row,
            col,
            i;

        myself.categories.children.forEach((button, i) => {
            row = i < 8 ? i % 4 : i - 4;
            col = (i < 4 || i > 7) ? 1 : 2;
            button.setPosition(new Point(
                l + (col * xPadding + ((col - 1) * buttonWidth)),
                t + (((row - shift) + 1) * yPadding + ((row - shift) *
                        buttonHeight) + border) +
                    (i > 7 ? border + 2 : 0)
            ));
        });

        if (shift) { // hide the built-in category buttons
            for (i = 0; i < 8; i += 1) {
                myself.categories.children[i].hide();
            }
        }

        if (more > 6) {
            scroller = new ScrollFrameMorph(null, null, myself.sliderColor);
            scroller.setColor(myself.groupColor);
            scroller.acceptsDrops = false;
            scroller.contents.acceptsDrops = false;
            scroller.setPosition(
                new Point(0, myself.categories.children[8].top())
            );
            scroller.setWidth(myself.paletteWidth);
            scroller.setHeight(buttonHeight * 6 + yPadding * 5);

            for (i = 0; i < more; i += 1) {
                scroller.addContents(myself.categories.children[8]);
            }
            myself.categories.add(scroller);
            myself.categories.scroller = scroller;
            myself.categories.setHeight(
                (4 + 1 - shift) * yPadding
                    + (4 - shift) * buttonHeight
                    + 6 * (yPadding + buttonHeight) + border + 2
                    + 2 * border
            );
        } else {
            myself.categories.setHeight(
                (4 + 1 - shift) * yPadding
                    + (4 - shift) * buttonHeight
                    + (more ?
                        (more * (yPadding + buttonHeight) + border + 2)
                            : 0)
                    + 2 * border
            );
        }
    }

    SpriteMorph.prototype.categories.forEach(cat => {
        if (!contains(['lists', 'other'], cat)) {
            addCategoryButton(cat);
        }
    });

    // sort alphabetically
    Array.from(
        SpriteMorph.prototype.customCategories.keys()
    ).sort().forEach(name =>
        addCustomCategoryButton(
            name,
            SpriteMorph.prototype.customCategories.get(name)
        )
    );

    fixCategoriesLayout();
    this.add(this.categories);
};

IDE_Morph.prototype.createPalette = function (forSearching) {
    // assumes that the logo pane has already been created
    // needs the categories pane for layout
    var myself = this,
        vScrollAction;

    if (this.palette) {
        this.palette.destroy();
    }

    if (forSearching) {
        this.palette = new ScrollFrameMorph(
            null,
            null,
            this.currentSprite.sliderColor
        );
        this.palette.isForSearching = true;

        // search toolbar (floating cancel button):
        /* commented out for now
        this.palette.toolBar = new PushButtonMorph(
            this,
            () => {
                this.refreshPalette();
                this.palette.adjustScrollBars();
            },
            new SymbolMorph("magnifierOutline", 16)
        );
        this.palette.toolBar.alpha = 0.2;
        this.palette.toolBar.padding = 1;
        // this.palette.toolBar.hint = 'Cancel';
        this.palette.toolBar.labelShadowColor = new Color(140, 140, 140);
        this.palette.toolBar.fixLayout();
        this.palette.add(this.palette.toolBar);
	    */

    } else {
        this.palette = this.currentSprite.palette(this.currentCategory);
    }
    this.palette.isDraggable = false;
    this.palette.acceptsDrops = true;
    this.palette.enableAutoScrolling = false;
    this.palette.contents.acceptsDrops = false;

    if (this.scene.unifiedPalette) {
        this.palette.adjustScrollBars = function () {
            ScrollFrameMorph.prototype.adjustScrollBars.call(this);
            myself.categories.refresh();
        };

        vScrollAction = this.palette.vBar.action;
        this.palette.vBar.action = function (num) {
            vScrollAction(num);
            myself.categories.buttons.forEach(each => each.refresh());
        };
    }

    this.palette.reactToDropOf = (droppedMorph, hand) => {
        if (droppedMorph instanceof DialogBoxMorph) {
            this.world().add(droppedMorph);
        } else if (droppedMorph instanceof SpriteMorph) {
            this.removeSprite(droppedMorph);
        } else if (droppedMorph instanceof SpriteIconMorph) {
            droppedMorph.destroy();
            this.removeSprite(droppedMorph.object);
        } else if (droppedMorph instanceof CostumeIconMorph) {
            // this.currentSprite.wearCostume(null); // do we need this?
            droppedMorph.perish(myself.isAnimating ? 200 : 0);
        } else if (droppedMorph instanceof BlockMorph) {
            this.stage.threads.stopAllForBlock(droppedMorph);
            if (hand && hand.grabOrigin.origin instanceof ScriptsMorph) {
                hand.grabOrigin.origin.clearDropInfo();
                hand.grabOrigin.origin.lastDroppedBlock = droppedMorph;
                hand.grabOrigin.origin.recordDrop(hand.grabOrigin);
            }
            droppedMorph.perish(myself.isAnimating ? 200 : 0);
            this.currentSprite.recordUserEdit(
                'scripts',
                'block',
                'delete',
                droppedMorph.abstractBlockSpec()
            );
        } else {
            droppedMorph.perish(myself.isAnimating ? 200 : 0);
            if (droppedMorph instanceof CommentMorph) {
                this.currentSprite.recordUserEdit(
                    'scripts',
                    'comment',
                    'delete'
                );
            }
        }
    };

    this.palette.contents.reactToDropOf = (droppedMorph) => {
        // for "undrop" operation
        if (droppedMorph instanceof BlockMorph) {
            droppedMorph.destroy();
        }
    };

    this.palette.droppedImage = (aCanvas, name, embeddedData) => {
        this.droppedImage(aCanvas, name, embeddedData, 'palette');
    };

    this.palette.setWidth(this.logo.width());
    this.add(this.palette);
    return this.palette;
};

IDE_Morph.prototype.createPaletteHandle = function () {
    // assumes that the palette has already been created
    if (this.paletteHandle) {this.paletteHandle.destroy(); }
    this.paletteHandle = new PaletteHandleMorph(this.categories);
    this.add(this.paletteHandle);
};

IDE_Morph.prototype.createStage = function () {
    if (this.stage) {
        this.stage.destroy();
    }
    this.add(this.scene.stage);
    this.stage = this.scene.stage;
};

IDE_Morph.prototype.createStageHandle = function () {
    // assumes that the stage has already been created
    if (this.stageHandle) {this.stageHandle.destroy(); }
    if (!this.performerMode) {
        this.stageHandle = new StageHandleMorph(this.stage);
        this.add(this.stageHandle);
    }
};

IDE_Morph.prototype.createSpriteBar = function () {
    // assumes that the categories pane has already been created
    var rotationStyleButtons = [],
        thumbSize = new Point(45, 45),
        nameField,
        padlock,
        thumbnail,
        tabCorner = 15,
        tabColors = this.tabColors,
        tabBar = new AlignmentMorph('row', -tabCorner * 2),
        tab,
        symbols = [
            new SymbolMorph('arrowRightThin', 10),
            new SymbolMorph('turnAround', 10),
            new SymbolMorph('arrowLeftRightThin', 10),
        ],
        labels = ['don\'t rotate', 'can rotate', 'only face left/right'],
        myself = this;

    if (this.spriteBar) {
        this.spriteBar.destroy();
    }

    this.spriteBar = new Morph();
    this.spriteBar.color = this.frameColor;
    this.add(this.spriteBar);

    function addRotationStyleButton(rotationStyle) {
        var colors = myself.rotationStyleColors,
            button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            () => {
                if (myself.currentSprite instanceof SpriteMorph) {
                    myself.currentSprite.rotationStyle = rotationStyle;
                    myself.currentSprite.changed();
                    myself.currentSprite.fixLayout();
                    myself.currentSprite.rerender();
                    myself.currentSprite.recordUserEdit(
                        'sprite',
                        'rotation',
                        rotationStyle
                    );
                }
                rotationStyleButtons.forEach(each =>
                    each.refresh()
                );
            },
            symbols[rotationStyle], // label
            () => myself.currentSprite instanceof SpriteMorph // query
                && myself.currentSprite.rotationStyle === rotationStyle,
            null, // environment
            localize(labels[rotationStyle])
        );

        button.corner = 8;
        button.labelMinExtent = new Point(11, 11);
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = myself.buttonLabelColor;
        button.fixLayout();
        button.refresh();
        rotationStyleButtons.push(button);
        button.setPosition(myself.spriteBar.position().add(new Point(2, 4)));
        button.setTop(button.top()
            + ((rotationStyleButtons.length - 1) * (button.height() + 2))
            );
        myself.spriteBar.add(button);
        if (myself.currentSprite instanceof StageMorph) {
            button.hide();
        }
        return button;
    }

    addRotationStyleButton(1);
    addRotationStyleButton(2);
    addRotationStyleButton(0);
    this.rotationStyleButtons = rotationStyleButtons;

    thumbnail = new Morph();
    thumbnail.isCachingImage = true;
    thumbnail.bounds.setExtent(thumbSize);
    thumbnail.cachedImage = this.currentSprite.thumbnail(thumbSize);
    thumbnail.setPosition(
        rotationStyleButtons[0].topRight().add(new Point(5, 3))
    );
    this.spriteBar.add(thumbnail);

    thumbnail.fps = 3;

    thumbnail.step = function () {
        if (thumbnail.version !== myself.currentSprite.version) {
            thumbnail.cachedImage = myself.currentSprite.thumbnail(
                thumbSize,
                thumbnail.cachedImage
            );
            thumbnail.changed();
            thumbnail.version = myself.currentSprite.version;
        }
    };

    nameField = new InputFieldMorph(this.currentSprite.name);
    nameField.setWidth(100); // fixed dimensions
    nameField.contrast = 90;
    nameField.setPosition(thumbnail.topRight().add(new Point(10, 3)));
    this.spriteBar.add(nameField);
    this.spriteBar.nameField = nameField;
    nameField.fixLayout();
    nameField.accept = function () {
        var newName = nameField.getValue();
        myself.currentSprite.setName(
            myself.newSpriteName(newName, myself.currentSprite)
        );
        nameField.setContents(myself.currentSprite.name);
    };
    this.spriteBar.reactToEdit = nameField.accept;

    // padlock
    padlock = new ToggleMorph(
        'checkbox',
        null,
        () => {
            this.currentSprite.isDraggable = !this.currentSprite.isDraggable;
            this.currentSprite.recordUserEdit(
                'sprite',
                'draggable',
                this.currentSprite.isDraggable
            );
        },
        localize('draggable'),
        () => this.currentSprite.isDraggable
    );
    padlock.label.isBold = false;
    padlock.label.setColor(this.buttonLabelColor);
    padlock.color = tabColors[2];
    padlock.highlightColor = tabColors[0];
    padlock.pressColor = tabColors[1];

    padlock.tick.shadowOffset = MorphicPreferences.isFlat ?
            ZERO : new Point(-1, -1);
    padlock.tick.shadowColor = BLACK;
    padlock.tick.color = this.buttonLabelColor;
    padlock.tick.isBold = false;
    padlock.tick.fixLayout();

    padlock.setPosition(nameField.bottomLeft().add(2));
    padlock.fixLayout();
    this.spriteBar.add(padlock);
    if (this.currentSprite instanceof StageMorph) {
        padlock.hide();
    }

    // tab bar
    tabBar.tabTo = function (tabString) {
        var active;
        if (myself.currentTab === tabString) {return; }
        myself.world().hand.destroyTemporaries();
        myself.currentTab = tabString;
        this.children.forEach(each => {
            each.refresh();
            if (each.state) {active = each; }
        });
        active.refresh(); // needed when programmatically tabbing
        myself.createSpriteEditor();
        myself.fixLayout('tabEditor');
    };

    tab = new TabMorph(
        tabColors,
        null, // target
        () => tabBar.tabTo('scripts'),
        localize('Scripts'), // label
        () => this.currentTab === 'scripts' // query
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;

    tab.getPressRenderColor = function () {
        if (MorphicPreferences.isFlat ||
                SyntaxElementMorph.prototype.alpha > 0.85) {
            return this.pressColor;
        }
        return this.pressColor.mixed(
            Math.max(SyntaxElementMorph.prototype.alpha - 0.15, 0),
            SpriteMorph.prototype.paletteColor
        );
    };

    tab.fixLayout();
    tabBar.add(tab);

    tab = new TabMorph(
        tabColors,
        null, // target
        () => tabBar.tabTo('costumes'),
        localize(this.currentSprite instanceof SpriteMorph ?
            'Costumes' : 'Backgrounds'
        ),
        () => this.currentTab === 'costumes' // query
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.fixLayout();
    tabBar.add(tab);

    tab = new TabMorph(
        tabColors,
        null, // target
        () => tabBar.tabTo('sounds'),
        localize('Sounds'), // label
        () => this.currentTab === 'sounds' // query
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.fixLayout();
    tabBar.add(tab);

    tabBar.fixLayout();
    tabBar.children.forEach(each =>
        each.refresh()
    );
    this.spriteBar.tabBar = tabBar;
    this.spriteBar.add(this.spriteBar.tabBar);

    this.spriteBar.fixLayout = function () {
        this.tabBar.setLeft(this.left());
        this.tabBar.setBottom(this.bottom() + myself.padding);
    };
};

IDE_Morph.prototype.createSpriteEditor = function () {
    // assumes that the logo pane and the stage have already been created
    var scripts = this.currentSprite.scripts;

    if (this.spriteEditor) {
        this.spriteEditor.destroy();
    }

    if (this.currentTab === 'scripts') {
        scripts.isDraggable = false;
        if (this.performerMode) {
            scripts.alpha = 0;
        } else {
            scripts.alpha = 1;
            scripts.color = this.groupColor;
            scripts.cachedTexture = MorphicPreferences.isFlat ? null
                : this.scriptsTexture();
        }

        this.spriteEditor = new ScrollFrameMorph(
            scripts,
            null,
            this.sliderColor
        );
        if (this.performerMode) {
            this.spriteEditor.alpha = 0;
        } else {
            this.spriteEditor.color = this.groupColor;
        }
        this.spriteEditor.padding = 10;
        this.spriteEditor.growth = 50;
        this.spriteEditor.isDraggable = false;
        this.spriteEditor.acceptsDrops = false;
        this.spriteEditor.contents.acceptsDrops = true;

        scripts.scrollFrame = this.spriteEditor;
        scripts.updateToolbar();
        this.add(this.spriteEditor);
        this.spriteEditor.scrollX(this.spriteEditor.padding);
        this.spriteEditor.scrollY(this.spriteEditor.padding);
    } else if (this.currentTab === 'costumes') {
        this.spriteEditor = new WardrobeMorph(
            this.currentSprite,
            this.sliderColor
        );
        this.spriteEditor.color = this.groupColor;
        this.add(this.spriteEditor);
        this.spriteEditor.updateSelection();

        this.spriteEditor.acceptsDrops = false;
        this.spriteEditor.contents.acceptsDrops = false;
    } else if (this.currentTab === 'sounds') {
        this.spriteEditor = new JukeboxMorph(
            this.currentSprite,
            this.sliderColor
        );
        this.spriteEditor.color = this.groupColor;
        this.add(this.spriteEditor);
        this.spriteEditor.updateSelection();
        this.spriteEditor.acceptDrops = false;
        this.spriteEditor.contents.acceptsDrops = false;
    } else {
        this.spriteEditor = new Morph();
        this.spriteEditor.color = this.groupColor;
        this.spriteEditor.acceptsDrops = true;
        this.spriteEditor.reactToDropOf = (droppedMorph) => {
            if (droppedMorph instanceof DialogBoxMorph) {
                this.world().add(droppedMorph);
            } else if (droppedMorph instanceof SpriteMorph) {
                this.removeSprite(droppedMorph);
            } else {
                droppedMorph.destroy();
            }
        };
        this.add(this.spriteEditor);
    }

    this.spriteEditor.mouseEnterDragging = (morph) => {
        if (morph instanceof BlockMorph) {
            this.spriteBar.tabBar.tabTo('scripts');
        } else if (morph instanceof CostumeIconMorph) {
            this.spriteBar.tabBar.tabTo('costumes');
        } else if (morph instanceof SoundIconMorph) {
            this.spriteBar.tabBar.tabTo('sounds');
        }
    };

    this.spriteEditor.contents.mouseEnterDragging =
        this.spriteEditor.mouseEnterDragging;
};

IDE_Morph.prototype.createCorralBar = function () {
    // assumes the stage has already been created
    var padding = 5,
        newbutton,
        paintbutton,
        cambutton,
        trashbutton,
        flag = true,
        myself = this,
        colors = IDE_Morph.prototype.isBright ? this.tabColors
        : [
            this.groupColor,
            this.frameColor.darker(50),
            this.frameColor.darker(50)
        ];

    if (this.corralBar) {
        flag = this.corralBar.isVisible;
        this.corralBar.destroy();
    }

    this.corralBar = new Morph();
    this.corralBar.color = this.frameColor;
    this.corralBar.isVisible = flag;
    this.corralBar.setHeight(this.logo.height()); // height is fixed
    this.corralBar.setWidth(this.stage.width());
    this.add(this.corralBar);

    // new sprite button
    newbutton = new PushButtonMorph(
        this,
        "addNewSprite",
        new SymbolMorph("turtle", 14)
    );
    newbutton.corner = 12;
    newbutton.color = colors[0];
    newbutton.highlightColor = colors[1];
    newbutton.pressColor = colors[2];
    newbutton.labelMinExtent = new Point(36, 18);
    newbutton.padding = 0;
    newbutton.labelShadowOffset = new Point(-1, -1);
    newbutton.labelShadowColor = colors[1];
    newbutton.labelColor = this.buttonLabelColor;
    newbutton.contrast = this.buttonContrast;
    newbutton.hint = "add a new Turtle sprite";
    newbutton.fixLayout();
    newbutton.setCenter(this.corralBar.center());
    newbutton.setLeft(this.corralBar.left() + padding);
    this.corralBar.add(newbutton);

    paintbutton = new PushButtonMorph(
        this,
        "paintNewSprite",
        new SymbolMorph("brush", 15)
    );
    paintbutton.corner = 12;
    paintbutton.color = colors[0];
    paintbutton.highlightColor = colors[1];
    paintbutton.pressColor = colors[2];
    paintbutton.labelMinExtent = new Point(36, 18);
    paintbutton.padding = 0;
    paintbutton.labelShadowOffset = new Point(-1, -1);
    paintbutton.labelShadowColor = colors[1];
    paintbutton.labelColor = this.buttonLabelColor;
    paintbutton.contrast = this.buttonContrast;
    paintbutton.hint = "paint a new sprite";
    paintbutton.fixLayout();
    paintbutton.setCenter(this.corralBar.center());
    paintbutton.setLeft(
        this.corralBar.left() + padding + newbutton.width() + padding
    );
    this.corralBar.add(paintbutton);

    if (CamSnapshotDialogMorph.prototype.enableCamera) {
        cambutton = new PushButtonMorph(
                this,
                "newCamSprite",
                new SymbolMorph("camera", 15)
                );
        cambutton.corner = 12;
        cambutton.color = colors[0];
        cambutton.highlightColor = colors[1];
        cambutton.pressColor = colors[2];
        cambutton.labelMinExtent = new Point(36, 18);
        cambutton.padding = 0;
        cambutton.labelShadowOffset = new Point(-1, -1);
        cambutton.labelShadowColor = colors[1];
        cambutton.labelColor = this.buttonLabelColor;
        cambutton.contrast = this.buttonContrast;
        cambutton.hint = "take a camera snapshot and\n" +
        	"import it as a new sprite";
        cambutton.fixLayout();
        cambutton.setCenter(this.corralBar.center());
        cambutton.setLeft(
            this.corralBar.left() +
            padding +
            newbutton.width() +
            padding +
            paintbutton.width() +
            padding
        );
        this.corralBar.add(cambutton);
        document.addEventListener(
            'cameraDisabled',
            event => {
                cambutton.disable();
                cambutton.hint =
                    CamSnapshotDialogMorph.prototype.notSupportedMessage;
            }
        );
    }

    // trash button
    trashbutton = new PushButtonMorph(
        this,
        "undeleteSprites",
        new SymbolMorph("trash", 18)
    );
    trashbutton.corner = 12;
    trashbutton.color = colors[0];
    trashbutton.highlightColor = colors[1];
    trashbutton.pressColor = colors[2];
    trashbutton.labelMinExtent = new Point(36, 18);
    trashbutton.padding = 0;
    trashbutton.labelShadowOffset = new Point(-1, -1);
    trashbutton.labelShadowColor = colors[1];
    trashbutton.labelColor = this.buttonLabelColor;
    trashbutton.contrast = this.buttonContrast;
    // trashbutton.hint = "bring back deleted sprites";
    trashbutton.fixLayout();
    trashbutton.setCenter(this.corralBar.center());
    trashbutton.setRight(this.corralBar.right() - padding);
    this.corralBar.add(trashbutton);

    trashbutton.wantsDropOf = (morph) =>
        morph instanceof SpriteMorph || morph instanceof SpriteIconMorph;

    trashbutton.reactToDropOf = (droppedMorph) => {
        if (droppedMorph instanceof SpriteMorph) {
            this.removeSprite(droppedMorph);
        } else if (droppedMorph instanceof SpriteIconMorph) {
            droppedMorph.destroy();
            this.removeSprite(droppedMorph.object);
        }
    };

    this.corralBar.fixLayout = function () {
        function updateDisplayOf(button) {
            if (button && button.right() > trashbutton.left() - padding) {
                button.hide();
            } else {
                button.show();
            }
        }
        this.setWidth(myself.stage.width());
        trashbutton.setRight(this.right() - padding);
        updateDisplayOf(cambutton);
        updateDisplayOf(paintbutton);
    };
};

IDE_Morph.prototype.createCorral = function (keepSceneAlbum) {
    // assumes the corral bar has already been created
    var frame, padding = 5, myself = this,
        album = this.corral? this.corral.album : null;

    this.createStageHandle();
    this.createPaletteHandle();

    if (this.corral) {
        this.corral.destroy();
    }

    this.corral = new Morph();
    this.corral.color = this.groupColor;
    this.corral.getRenderColor = ScriptsMorph.prototype.getRenderColor;

    this.add(this.corral);

    this.corral.stageIcon = new SpriteIconMorph(this.stage);
    this.corral.stageIcon.isDraggable = false;
    this.corral.add(this.corral.stageIcon);

    frame = new ScrollFrameMorph(null, null, this.sliderColor);
    frame.acceptsDrops = false;
    frame.contents.acceptsDrops = false;

    frame.contents.wantsDropOf = (morph) => morph instanceof SpriteIconMorph;

    frame.contents.reactToDropOf = (spriteIcon) =>
        this.corral.reactToDropOf(spriteIcon);

    frame.alpha = 0;

    this.sprites.asArray().forEach(morph => {
        if (!morph.isTemporary) {
            frame.contents.add(new SpriteIconMorph(morph));
        }
    });

    this.corral.frame = frame;
    this.corral.add(frame);

    // scenes corral
    this.corral.album = keepSceneAlbum ? album
            : new SceneAlbumMorph(this, this.sliderColor);
    this.corral.album.color = this.frameColor;
    this.corral.add(this.corral.album);

    this.corral.fixLayout = function () {
        this.stageIcon.setCenter(this.center());
        this.stageIcon.setLeft(this.left() + padding);

        // scenes
        if (myself.scenes.length() < 2) {
            this.album.hide();
        } else {
            this.stageIcon.setTop(this.top());
            this.album.show();
            this.album.setLeft(this.left());
            this.album.setTop(this.stageIcon.bottom() + padding);
            this.album.setWidth(this.stageIcon.width() + padding * 2);
            this.album.setHeight(
                this.height() - this.stageIcon.height() - padding
            );
        }

        this.frame.setLeft(this.stageIcon.right() + padding);
        this.frame.setExtent(new Point(
            this.right() - this.frame.left(),
            this.height()
        ));
        this.arrangeIcons();
        this.refresh();
    };

    this.corral.arrangeIcons = function () {
        var x = this.frame.left(),
            y = this.frame.top(),
            max = this.frame.right(),
            start = this.frame.left();

        this.frame.contents.children.forEach(icon => {
            var w = icon.width();

            if (x + w > max) {
                x = start;
                y += icon.height(); // they're all the same
            }
            icon.setPosition(new Point(x, y));
            x += w;
        });
        this.frame.contents.adjustBounds();
    };

    this.corral.addSprite = function (sprite) {
        this.frame.contents.add(new SpriteIconMorph(sprite));
        this.fixLayout();
        sprite.recordUserEdit(
            'corral',
            'add',
            sprite.name
        );
    };

    this.corral.refresh = function () {
        this.stageIcon.refresh();
        this.frame.contents.children.forEach(icon =>
            icon.refresh()
        );
    };

    this.corral.wantsDropOf = (morph) => morph instanceof SpriteIconMorph;

    this.corral.reactToDropOf = function (spriteIcon) {
        var idx = 1,
            pos = spriteIcon.position();
        spriteIcon.destroy();
        this.frame.contents.children.forEach(icon => {
            if (pos.gt(icon.position()) || pos.y > icon.bottom()) {
                idx += 1;
            }
        });
        myself.sprites.add(spriteIcon.object, idx);
        myself.createCorral(true); // keep scenes
        myself.fixLayout();
    };
};

// IDE_Morph layout

IDE_Morph.prototype.fixLayout = function (situation) {
    // situation is a string, i.e.
    // 'selectSprite' or 'refreshPalette' or 'tabEditor'
    var padding = this.padding,
        cnf = this.config,
        border = cnf.border || 0,
        flag,
        maxPaletteWidth;

    // logo
    this.logo.setLeft(this.left() + border);
    this.logo.setTop(this.top() + border);

    if (situation !== 'refreshPalette') {
        // controlBar
        this.controlBar.setPosition(this.logo.topRight());
        this.controlBar.setWidth(
            this.right() - this.controlBar.left() - border
        );
        this.controlBar.fixLayout();

        // categories
        this.categories.setLeft(this.logo.left());
        this.categories.setTop(
            cnf.hideControls ? this.top() + border : this.logo.bottom()
        );
        this.categories.setWidth(this.paletteWidth);
        if (this.categories.scroller) {
            this.categories.scroller.setWidth(this.paletteWidth);
        }
    }

    // palette
    this.palette.setLeft(this.logo.left());
    this.palette.setTop(
        cnf.hideCategories ?
            (cnf.hideControls ?
                this.top() + border
                : this.controlBar.bottom() + padding)
            : this.categories.bottom()
    );
    this.palette.setHeight(this.bottom() - this.palette.top() - border);
    this.palette.setWidth(this.paletteWidth);

    if (situation !== 'refreshPalette') {
        // stage
        if (this.performerMode) {
            this.stage.setLeft(this.palette.right() + padding);
            this.stage.setTop(this.spriteBar.bottom() + padding);
            this.stage.setScale(1);
            this.stageRatio = 1;
            this.isSmallStage = false;
            this.stage.dimensions = new Point(
                    this.width() - this.palette.width(),
                    this.palette.height() -
                        this.corralBar.height() -
                        this.corral.childThatIsA(SpriteIconMorph).height()
            );
            this.stage.stopVideo();
            this.stage.setExtent(this.stage.dimensions);
            this.stage.resizePenTrails();
            Costume.prototype.maxDimensions = this.stage.dimensions;
            this.paletteHandle.fixLayout();
            this.controlBar.stageSizeButton.hide();
        } else if (this.isEmbedMode) {
            this.stage.setScale(Math.floor(Math.min(
                this.width() / this.stage.dimensions.x,
                this.height() / this.stage.dimensions.y
                ) * 100) / 100);
            flag = this.embedPlayButton.flag;
            flag.size = Math.floor(Math.min(
                        this.width(), this.height())) / 5;
            flag.fixLayout();
            this.embedPlayButton.size = flag.size * 1.6;
            this.embedPlayButton.fixLayout();
            if (this.embedOverlay) {
                this.embedOverlay.setExtent(this.extent());
            }
            this.stage.setCenter(this.center());
            this.embedPlayButton.setCenter(this.stage.center());
            flag.setCenter(this.embedPlayButton.center());
            flag.setLeft(flag.left() + flag.size * 0.1); // account for slight asymmetry
        } else if (this.isAppMode) {
            this.stage.setScale(Math.floor(Math.min(
                (this.width() - padding * 2) / this.stage.dimensions.x,
                (this.height() - this.controlBar.height() * 2 - padding * 2)
                    / this.stage.dimensions.y
            ) * 10) / 10);
            this.stage.setCenter(this.center());
        } else {
            this.stage.setScale(this.isSmallStage ? this.stageRatio : 1);
            this.stage.setTop(
                cnf.hideControls ?
                    this.top() + border
                        : this.logo.bottom() + padding
            );
            this.stage.setRight(this.right() - border);
            if (cnf.noSprites) {
                maxPaletteWidth = Math.max(
                    200,
                    this.width() -
                    border * 2
                );
            } else {
                maxPaletteWidth = Math.max(
                    200,
                    this.width() -
                        this.stage.width() -
                        this.spriteBar.tabBar.width() -
                        padding * 2 -
                        border * 2
                );
            }
            if (this.paletteWidth > maxPaletteWidth) {
                this.paletteWidth = maxPaletteWidth;
                this.fixLayout();
            }
            this.stageHandle.fixLayout();
            this.paletteHandle.fixLayout();
        }

        // spriteBar
        this.spriteBar.setLeft(cnf.noPalette ?
            this.left() + border
            : this.paletteWidth + padding + border
        );
        this.spriteBar.setTop(
            cnf.hideControls ?
                this.top() + border
                    : this.logo.bottom() + padding
        );
        this.spriteBar.setWidth(
            Math.max(0, this.stage.left() - padding - this.spriteBar.left())
        );
        this.spriteBar.setHeight(
            Math.round(this.logo.height() * 2.6)
        );
        this.spriteBar.fixLayout();

        // spriteEditor
        if (this.spriteEditor.isVisible) {
            if (this.performerMode) {
                this.spriteEditor.setTop(this.stage.top());
                this.spriteEditor.setLeft(this.stage.left());
                this.spriteEditor.setWidth(this.stage.width());
                this.spriteEditor.setHeight(this.stage.height());
            } else {
                this.spriteEditor.setLeft(this.spriteBar.left());
                this.spriteEditor.setTop(
                    cnf.noSprites || cnf.noSpriteEdits ?
                    (cnf.hideControls ? this.top() + border
                        : this.controlBar.bottom() + padding)
                    : this.spriteBar.bottom() + padding
                );
                this.spriteEditor.setWidth(
                    cnf.noSprites ?
                        this.right() - this.spriteEditor.left() - border
                        : this.spriteBar.width()
                );
                this.spriteEditor.setHeight(
                    this.bottom() - this.spriteEditor.top() - border
                );
            }
        }

        // corralBar
        this.corralBar.setLeft(this.stage.left());
        this.corralBar.setTop(this.stage.bottom() + padding);
        this.corralBar.setWidth(this.stage.width());

        // corral
        if (!contains(['selectSprite', 'tabEditor'], situation)) {
            this.corral.setPosition(this.corralBar.bottomLeft());
            this.corral.setWidth(this.stage.width());
            this.corral.setHeight(this.bottom() - this.corral.top() - border);
            this.corral.fixLayout();
        }
    }
};

// IDE_Morph project properties

IDE_Morph.prototype.getProjectName = function () {
    return this.scenes.at(1).name;
};

IDE_Morph.prototype.setProjectName = function (string) {
    var projectScene = this.scenes.at(1),
        name = this.newSceneName(string, projectScene);
    if (name !== projectScene.name) {
        projectScene.name = name;
        projectScene.stage.version = Date.now();
        this.recordUnsavedChanges();
        if (projectScene === this.scene) {
            this.controlBar.updateLabel();
        }
    }
    return name;
};

IDE_Morph.prototype.getProjectNotes = function () {
    return this.scenes.at(1).notes;
};

IDE_Morph.prototype.setProjectNotes = function (string) {
    var projectScene = this.scenes.at(1);
    if (string !== projectScene.notes) {
        projectScene.notes = string;
        projectScene.stage.version = Date.now();
        this.recordUnsavedChanges();
        if (projectScene === this.scene) {
            this.controlBar.updateLabel();
        }
    }
};

// IDE_Morph resizing

IDE_Morph.prototype.setExtent = function (point) {
    var cnf = this.config,
        padding = new Point(430, 110),
        minExt,
        ext,
        maxWidth,
        minWidth,
        maxHeight,
        minRatio,
        maxRatio;

    // determine the minimum dimensions making sense for the current mode
    if (this.isAppMode) {
        minExt = new Point(100, 100);
        if (!this.isEmbedMode) {
            minExt = minExt.add(this.controlBar.height() + 10);
        }
    } else if (cnf.noSprites) {
        minExt = new Point(100, 100);
    } else {
        if (this.stageRatio > 1) {
            minExt = padding.add(this.stage.dimensions);
        } else {
            minExt = padding.add(
                this.stage.dimensions.multiplyBy(this.stageRatio)
            );
        }
    }
    if (this.performerMode) {
        ext = point;
    } else {
        ext = point.max(minExt);
    }
    if (!this.isAppMode) {
        // in edit mode adjust stage ratio if necessary
        // (in presentation mode this is already handled separately)
        if (!cnf.noSprites) {
            maxWidth = ext.x -
                (200 + this.spriteBar.tabBar.width() + (this.padding * 2));
            minWidth = SpriteIconMorph.prototype.thumbSize.x * 3;
            maxHeight = (ext.y - SpriteIconMorph.prototype.thumbSize.y * 3.5);
            minRatio = minWidth / this.stage.dimensions.x;
            maxRatio = Math.min(
                (maxWidth / this.stage.dimensions.x),
                (maxHeight / this.stage.dimensions.y)
            );
            this.stageRatio = Math.min(
                maxRatio,
                Math.max(minRatio,this.stageRatio)
            );
        }
    }

    // apply
    IDE_Morph.uber.setExtent.call(this, ext);
    this.fixLayout();
};

// IDE_Morph rendering

IDE_Morph.prototype.render = function (ctx) {
    var frame;
    IDE_Morph.uber.render.call(this, ctx);
    if (this.isAppMode && this.stage) {
        // draw a subtle outline rectangle around the stage
        // in presentation mode
        frame = this.stage.bounds.translateBy(
            this.position().neg()
        ).expandBy(2);
        ctx.strokeStyle = (this.isBright ? this.backgroundColor
            : this.groupColor).toString();
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(frame.origin.x, frame.origin.y);
        ctx.lineTo(frame.corner.x, frame.origin.y);
        ctx.lineTo(frame.corner.x, frame.corner.y);
        ctx.lineTo(frame.origin.x, frame.corner.y);
        ctx.closePath();
        ctx.stroke();
    }
};

// IDE_Morph events

IDE_Morph.prototype.reactToWorldResize = function (rect) {
    if (this.isAutoFill) {
        this.setPosition(rect.origin);
        this.setExtent(rect.extent());
    }
    if (this.filePicker) {
        document.body.removeChild(this.filePicker);
        this.filePicker = null;
        this.isImportingLocalFile = false;
    }
};

IDE_Morph.prototype.beginBulkDrop = function () {
    this.bulkDropInProgress = true;
    this.cachedSceneFlag = this.isAddingScenes;
    this.isAddingScenes = true;
};

IDE_Morph.prototype.endBulkDrop = function () {
    this.isAddingScenes = this.cachedSceneFlag;
    this.bulkDropInProgress = false;
};

IDE_Morph.prototype.droppedImage = function (aCanvas, name, embeddedData, src) {
    if (this.config.noImports) {return; }

    var costume = new Costume(
        aCanvas,
        this.currentSprite.newCostumeName(
            name ? name.split('.')[0] : '' // up to period
        )
    );

    if (costume.isTainted()) {
        this.inform(
            'Unable to import this image',
            'The picture you wish to import has been\n' +
                'tainted by a restrictive cross-origin policy\n' +
                'making it unusable for costumes in Snap!. \n\n' +
                'Try downloading this picture first to your\n' +
                'computer, and import it from there.'
        );
        return;
    }

    // directly import embedded blocks if the image was dropped on
    // a scripting area or the palette, otherwise import as costume
    // (with embedded data)
    if (!this.isImportingLocalFile &&
        isString(embeddedData) &&
        ['scripts', 'palette', 'categories'].includes(src) &&
        embeddedData[0] === '<' &&
        ['blocks', 'block', 'script', 'sprite'].some(tag =>
            embeddedData.slice(1).startsWith(tag))
    ) {
        this.isImportingLocalFile = false;
        return this.droppedText(embeddedData, name, '');
    }

    this.isImportingLocalFile = false;
    costume.embeddedData = embeddedData || null;
    this.currentSprite.addCostume(costume);
    this.currentSprite.wearCostume(costume);
    this.spriteBar.tabBar.tabTo('costumes');
    this.spriteEditor.updateList();
    this.hasChangedMedia = true;
    this.currentSprite.recordUserEdit(
        'costume',
        'imported',
        costume.name
    );
};

IDE_Morph.prototype.droppedSVG = function (anImage, name) {
    if (this.config.noImports) {return; }

    var myself,
        viewBox,
        w = 300, h = 150, // setting HTMLImageElement default values
        scale = 1,
        svgNormalized,
        headerLenght = anImage.src.search('base64') + 7,
            // usually 26 from "data:image/svg+xml;base64,"
        svgStrEncoded = anImage.src.substring(headerLenght),
        svgObj = new DOMParser().parseFromString(
            atob(svgStrEncoded), "image/svg+xml"
        ).firstElementChild,
        normalizing = false;

    name = name.split('.')[0];

    // checking for svg 'width' and 'height' attributes
    if (svgObj.attributes.getNamedItem("width") &&
            svgObj.attributes.getNamedItem("height")) {
        w = parseFloat(svgObj.attributes.getNamedItem("width").value);
        h = parseFloat(svgObj.attributes.getNamedItem("height").value);
    } else {
        normalizing = true;
    }

    // checking for svg 'viewBox' attribute
    if (svgObj.attributes.getNamedItem("viewBox")) {
        viewBox = svgObj.attributes.getNamedItem('viewBox').value;
        viewBox = viewBox.split(/[ ,]/).filter(item => item);
        if (viewBox.length == 4) {
            if (normalizing) {
                w = parseFloat(viewBox[2]);
                h = parseFloat(viewBox[3]);
            }
        }
    } else {
        svgObj.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        normalizing = true;
    }

    // checking if the costume is bigger than the stage and, if so, fit it
    if (this.stage.dimensions.x < w || this.stage.dimensions.y < h) {
        scale = Math.min(
            (this.stage.dimensions.x / w),
            (this.stage.dimensions.y / h)
        );
        normalizing = true;
        w = w * scale;
        h = h * scale;
    }

    // loading image, normalized if it needed
    // all the images are:
        // sized, with 'width' and 'height' attributes
        // fitted to stage dimensions
        // and with their 'viewBox' attribute
    if (normalizing) {
        svgNormalized = new Image(w, h);
        svgObj.setAttribute('width', w);
        svgObj.setAttribute('height', h);
        svgNormalized.src = 'data:image/svg+xml;base64,' +
            btoa(new XMLSerializer().serializeToString(svgObj));
        myself = this;
        svgNormalized.onload = () => myself.loadSVG(svgNormalized, name);
    } else {
        this.loadSVG(anImage, name);
    }
};

IDE_Morph.prototype.loadSVG = function (anImage, name) {
    var costume = new SVG_Costume(anImage, name);

    this.currentSprite.addCostume(costume);
    this.currentSprite.wearCostume(costume);
    this.spriteBar.tabBar.tabTo('costumes');
    this.spriteEditor.updateList();
    this.hasChangedMedia = true;
};

IDE_Morph.prototype.droppedAudio = function (anAudio, name) {
    if (this.config.noImports) {return; }

    if (anAudio.src.indexOf('data:audio') !== 0) {
        // fetch and base 64 encode samples using FileReader
        this.getURL(
            anAudio.src,
            blob => {
                var reader = new window.FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                	var base64 = reader.result;
                    base64 = 'data:audio/mpeg;base64,' +
                        base64.split(',')[1];
                    anAudio.src = base64;
                    this.droppedAudio(anAudio, name);
                };
            },
            'blob'
        );
    } else {
    	this.currentSprite.addSound(anAudio, name.split('.')[0]); // up to '.'
    	this.spriteBar.tabBar.tabTo('sounds');
    	this.hasChangedMedia = true;
        this.currentSprite.recordUserEdit(
            'sound',
            'imported',
            name
        );
    }
};

IDE_Morph.prototype.droppedText = function (aString, name, fileType) {
    if (this.config.noImports) {return; }

    var lbl = name ? name.split('.')[0] : '',
        ext = name ? name.slice(name.lastIndexOf('.') + 1).toLowerCase() : '',
        setting = this.isAddingScenes;

    // handle the special situation of adding a scene to the current project
    if (this.isAddingNextScene) {
        this.isAddingScenes = true;
        if (aString.indexOf('<project') === 0) {
            location.hash = '';
            this.openProjectString(aString);
        } else if (aString.indexOf('<snapdata') === 0) {
            location.hash = '';
            this.openCloudDataString(aString);
        }
        this.isAddingScenes = setting;
        this.isAddingNextScene = false;
        return;
    }

    // check for Snap specific files, projects, libraries, sprites, scripts
    if (aString.indexOf('<project') === 0) {
        this.backup(
            () => {
                location.hash = '';
                this.openProjectString(aString);
            }
        );
        return;
    }
    if (aString.indexOf('<snapdata') === 0) {
        location.hash = '';
        return this.openCloudDataString(aString);
    }

    this.recordUnsavedChanges();

    if (aString.indexOf('<blocks') === 0) {
        return this.openBlocksString(aString, lbl, true);
    }
    if (aString.indexOf('<sprites') === 0) {
        return this.openSpritesString(aString);
    }
    if (aString.indexOf('<media') === 0) {
        return this.openMediaString(aString);
    }
    if (aString.indexOf('<block') === 0) {
        aString = '<script>' + aString + '</script>';
    }
    if (aString.indexOf('<scriptsonly') === 0) {
        return this.openScriptsOnlyString(aString);
    }
    if (aString.indexOf('<script') === 0) {
        return this.openScriptString(aString);
    }

    // check for encoded data-sets, CSV, JSON
    if (fileType.indexOf('csv') !== -1 || ext === 'csv') {
        return this.openDataString(aString, lbl, 'csv');
    }
    if (fileType.indexOf('json') !== -1 || ext === 'json') {
        return this.openDataString(aString, lbl, 'json');
    }

    // import as plain text data
    this.openDataString(aString, lbl, 'text');
};

IDE_Morph.prototype.droppedBinary = function (anArrayBuffer, name) {
    if (this.config.noImports) {return; }

    // dynamically load ypr->Snap!
    var ypr = document.getElementById('ypr'),
        myself = this,
        suffix = name.substring(name.length - 3);

    if (suffix.toLowerCase() !== 'ypr') {return; }

    function loadYPR(buffer, lbl) {
        var reader = new sb.Reader(),
            pname = lbl.split('.')[0]; // up to period
        reader.onload = function (info) {
            myself.droppedText(new sb.XMLWriter().write(pname, info));
        };
        reader.readYPR(new Uint8Array(buffer));
    }

    if (!ypr) {
        ypr = document.createElement('script');
        ypr.id = 'ypr';
        ypr.onload = function () {loadYPR(anArrayBuffer, name); };
        document.head.appendChild(ypr);
        ypr.src = this.resourceURL('src', 'ypr.js');
    } else {
        loadYPR(anArrayBuffer, name);
    }
};

// IDE_Morph button actions

IDE_Morph.prototype.refreshPalette = function (shouldIgnorePosition) {
    var oldTop = this.palette.contents.top();

    this.createPalette();
    if (this.isAppMode) {
        this.palette.hide();
        return;
    }
    this.fixLayout('refreshPalette');
    if (!shouldIgnorePosition) {
        this.palette.contents.setTop(oldTop);
    }
    this.palette.adjustScrollBars();
};

IDE_Morph.prototype.scrollPaletteToCategory = function (category) {
    var palette = this.palette,
        msecs = this.isAnimating ? 200 : 0,
        firstInCategory,
        delta;

    if (palette.isForSearching) {
        this.refreshPalette();
        palette = this.palette;
    }
    firstInCategory = palette.contents.children.find(
        block => block.category === category
    );
    if (firstInCategory === undefined) {return; }
    delta = palette.top() - firstInCategory.top() + palette.padding;
    if (delta === 0) {return; }
    this.world().animations.push(new Animation(
        y => { // setter
            palette.contents.setTop(y);
            palette.contents.keepInScrollFrame();
            palette.adjustScrollBars();
        },
        () => palette.contents.top(), // getter
        delta, // delta
        msecs, // duration in ms
        t => Math.pow(t, 6), // easing
        null // onComplete
    ));
};

IDE_Morph.prototype.topVisibleCategoryInPalette = function () {
    // private - answer the topmost (partially) visible
    // block category in the palette, so it can be indicated
    // as "current category" in the category selection buttons
    var top;
    if (!this.palette) {return; }
    top = this.palette.contents.children.find(morph =>
        morph.category && morph.bounds.intersects(this.palette.bounds)
    );
    if (top) {
        if (top.category === 'other') {
            if (top.selector === 'doWarp') {
                return 'control';
            }
            if (top instanceof RingMorph) {
                return 'operators';
            }
            return 'variables';
        }
        if (top.category === 'lists') {
            return 'variables';
        }
        return top.category;
    }
    return null;
};

IDE_Morph.prototype.pressStart = function () {
    if (this.world().currentKey === 16) { // shiftClicked
        this.toggleFastTracking();
    } else {
        this.stage.threads.pauseCustomHatBlocks = false;
        this.controlBar.stopButton.refresh();
        this.runScripts();
    }
};

IDE_Morph.prototype.toggleFastTracking = function () {
    if (this.stage.isFastTracked) {
        this.stopFastTracking();
    } else {
        this.startFastTracking();
    }
};

IDE_Morph.prototype.toggleSingleStepping = function () {
    this.stage.threads.toggleSingleStepping();
    this.controlBar.steppingButton.refresh();
    this.controlBar.refreshSlider();
};

IDE_Morph.prototype.toggleCameraSupport = function () {
    CamSnapshotDialogMorph.prototype.enableCamera =
        !CamSnapshotDialogMorph.prototype.enableCamera;
    this.spriteBar.tabBar.tabTo(this.currentTab);
    this.createCorralBar();
    this.fixLayout();
};

IDE_Morph.prototype.startFastTracking = function () {
    this.stage.isFastTracked = true;
    this.controlBar.startButton.labelString = new SymbolMorph('flash', 14);
    this.controlBar.startButton.createLabel();
    this.controlBar.startButton.fixLayout();
    this.controlBar.startButton.rerender();
};

IDE_Morph.prototype.stopFastTracking = function () {
    this.stage.isFastTracked = false;
    this.controlBar.startButton.labelString = new SymbolMorph('flag', 14);
    this.controlBar.startButton.createLabel();
    this.controlBar.startButton.fixLayout();
    this.controlBar.startButton.rerender();
};

IDE_Morph.prototype.runScripts = function () {
    if (this.stage.threads.pauseCustomHatBlocks) {
        this.stage.threads.pauseCustomHatBlocks = false;
        this.controlBar.stopButton.refresh();
    }
    this.stage.fireGreenFlagEvent();
};

IDE_Morph.prototype.togglePauseResume = function () {
    if (this.stage.threads.isPaused()) {
        this.stage.threads.resumeAll(this.stage);
    } else {
        this.stage.threads.pauseAll(this.stage);
    }
    this.controlBar.pauseButton.refresh();
};

IDE_Morph.prototype.isPaused = function () {
    if (!this.stage) {return false; }
    return this.stage.threads.isPaused();
};

IDE_Morph.prototype.stopAllScripts = function () {
    if (this.world().currentKey === 16) { // shiftClicked
        this.scenes.map(scn => scn.stop(true));
    } else {
        this.scene.stop();
    }
    this.controlBar.stopButton.refresh();
};

IDE_Morph.prototype.selectSprite = function (sprite, noEmptyRefresh) {
    // prevent switching to another sprite if a block editor or a block
    // visibility dialog box is open
    // so local blocks of different sprites don't mix
    if (
        detect(
            this.world().children,
            morph => morph instanceof BlockEditorMorph ||
                morph instanceof BlockDialogMorph ||
                morph instanceof BlockVisibilityDialogMorph
        )
    ) {
        return;
    }
    if (this.currentSprite && this.currentSprite.scripts.focus) {
        this.currentSprite.scripts.focus.stopEditing();
    }
    this.currentSprite = sprite;
    this.scene.currentSprite = sprite;
    if (!noEmptyRefresh) {
        this.categories.refreshEmpty();
    }
    this.createPalette();
    this.createSpriteBar();
    this.createSpriteEditor();
    this.corral.refresh();
    this.fixLayout('selectSprite');
    if (this.performerMode) {
        this.fixLayout();
        this.currentSprite.scripts.updateToolbar();
    }
    this.currentSprite.scripts.fixMultiArgs();
};

// IDE_Morph retina display support

IDE_Morph.prototype.toggleRetina = function () {
    if (isRetinaEnabled()) {
        disableRetinaSupport();
    } else {
        enableRetinaSupport();
    }
    this.world().fillPage();
    if (!MorphicPreferences.isFlat) {
        IDE_Morph.prototype.scriptsPaneTexture = this.scriptsTexture();
    }
    this.stage.clearPenTrails();
    this.refreshIDE();
};

// IDE_Morph skins

IDE_Morph.prototype.defaultLooks = function () {
    this.setDefaultDesign();
    this.setDefaultTheme();
    this.refreshIDE();
    this.removeSetting('design');
    this.removeSetting('theme');
};

IDE_Morph.prototype.flatBrightLooks = function () {
    this.setFlatDesign();
    this.setBrightTheme();
    this.refreshIDE();
    this.saveSetting('design', 'flat');
    this.saveSetting('theme', 'bright');
};

IDE_Morph.prototype.defaultDesign = function () {
    this.setDefaultDesign();
    this.refreshIDE();
    this.removeSetting('design');
};

IDE_Morph.prototype.flatDesign = function () {
    this.setFlatDesign();
    this.refreshIDE();
    this.saveSetting('design', 'flat');
};

IDE_Morph.prototype.defaultTheme = function () {
    this.setDefaultTheme();
    this.refreshIDE();
    this.removeSetting('theme');
};

IDE_Morph.prototype.brightTheme = function () {
    this.setBrightTheme();
    this.refreshIDE();
    this.saveSetting('theme', 'bright');
};

IDE_Morph.prototype.refreshIDE = function () {
    var projectData;

    this.scene.captureGlobalSettings();
    if (Process.prototype.isCatchingErrors) {
        try {
            projectData = this.serializer.serialize(
                new Project(this.scenes, this.scene)
            );
        } catch (err) {
            this.showMessage('Serialization failed: ' + err);
        }
    } else {
        projectData = this.serializer.serialize(
            new Project(this.scenes, this.scene)
        );
    }
    SpriteMorph.prototype.initBlocks();
    this.buildPanes();
    this.fixLayout();
    if (this.loadNewProject) {
        this.newProject();
    } else {
        this.openProjectString(projectData);
    }
};

// IDE_Morph settings persistance

IDE_Morph.prototype.applySavedSettings = function () {
    if (this.config.noUserSettings) {return; }

    var design = this.getSetting('design'),
        theme = this.getSetting('theme'),
        zoom = this.getSetting('zoom'),
        fade = this.getSetting('fade'),
        glow = this.getSetting('glow'),
        language = this.getSetting('language'),
        click = this.getSetting('click'),
        longform = this.getSetting('longform'),
        plainprototype = this.getSetting('plainprototype'),
        keyboard = this.getSetting('keyboard'),
        tables = this.getSetting('tables'),
        tableLines = this.getSetting('tableLines'),
        autoWrapping = this.getSetting('autowrapping'),
        solidshadow = this.getSetting('solidshadow');

    // design
    if (design === 'flat') {
        this.setFlatDesign();
    } else {
        this.setDefaultDesign();
    }

    // theme
    if (theme === 'bright') {
        this.setBrightTheme();
    } else {
        this.setDefaultTheme();
    }

    // blocks zoom
    if (zoom) {
        SyntaxElementMorph.prototype.setScale(Math.min(zoom, 12));
        CommentMorph.prototype.refreshScale();
    }

    // blocks fade
    if (!isNil(fade)) {
        this.setBlockTransparency(+fade);
    }

    // blocks afterglow //
    if (isNil(glow)) {
        this.setBlocksAfterglow(5);
    } else {
        this.setBlocksAfterglow(Math.max(0, Math.min(glow, 20)));
    }

    // language
    if (language && language !== 'en') {
        this.userLanguage = language;
    } else {
        this.userLanguage = null;
    }

    //  click
    if (click && !BlockMorph.prototype.snapSound) {
        BlockMorph.prototype.toggleSnapSound();
    }

    // long form
    if (longform) {
        InputSlotDialogMorph.prototype.isLaunchingExpanded = true;
    }

    // keyboard editing
    if (keyboard === 'false') {
        ScriptsMorph.prototype.enableKeyboard = false;
    } else {
        ScriptsMorph.prototype.enableKeyboard = true;
    }

    // tables
    if (tables === 'false') {
        List.prototype.enableTables = false;
    } else {
        List.prototype.enableTables = true;
    }

    // tableLines
    if (tableLines) {
        TableMorph.prototype.highContrast = true;
    } else {
        TableMorph.prototype.highContrast = false;
    }

    // nested auto-wrapping
    if (autoWrapping === 'false') {
        ScriptsMorph.prototype.enableNestedAutoWrapping = false;
    } else {
        ScriptsMorph.prototype.enableNestedAutoWrapping = true;
    }

    // plain prototype labels
    if (plainprototype) {
        BlockLabelPlaceHolderMorph.prototype.plainLabel = true;
    }

    // solid shadow
    if (solidshadow) {
        window.useBlurredShadows = false;
        this.rerender();
    }
};

IDE_Morph.prototype.saveSetting = function (key, value) {
    if (!this.savingPreferences || this.config.noUserSettings) {
        return;
    }
    if (this.hasLocalStorage()) {
        localStorage['-snap-setting-' + key] = value;
    }
};

IDE_Morph.prototype.getSetting = function (key) {
    if (this.hasLocalStorage()) {
        return localStorage['-snap-setting-' + key];
    }
    return null;
};

IDE_Morph.prototype.removeSetting = function (key) {
    if (this.hasLocalStorage()) {
        delete localStorage['-snap-setting-' + key];
    }
};

IDE_Morph.prototype.hasLocalStorage = function () {
	// checks whether localStorage is available,
    // this kludgy try/catch mechanism is needed
    // because Safari 11 is paranoid about accessing
    // localstorage from the file:// protocol
	try {
		return !isNil(localStorage);
	} catch (err) {
    	return false;
	}
};

// IDE_Morph recording unsaved changes

IDE_Morph.prototype.hasUnsavedEdits = function () {
    return this.scenes.itemsArray().some(any => any.hasUnsavedEdits);
};

IDE_Morph.prototype.recordUnsavedChanges = function (spriteName, details) {
    this.scene.hasUnsavedEdits = true;
    this.updateChanges(spriteName, details);
};

IDE_Morph.prototype.recordSavedChanges = function () {
    this.scenes.itemsArray().forEach(scene => scene.hasUnsavedEdits = false);
    this.updateChanges(this.currentSprite.name, ['project', 'save']);
};

IDE_Morph.prototype.updateChanges = function (spriteName, details) {
    // private
    // invalidate saved backup, if any - but don't actually delete it yet
    if (this.hasLocalStorage() &&
        (localStorage['-snap-bakuser-'] == this.cloud.username)) {
            localStorage['-snap-bakflag-'] = 'expired';
    }

    // update the version timestamp so my observer can react
    this.version = Date.now();

    // indicate unsaved changes in the project title display
    this.controlBar.updateLabel();

    // trigger an event
    this.stage.fireUserEditEvent(
        spriteName || this.currentSprite.name,
        details || [],
        this.version
    );
};

// IDE_Morph project backup

IDE_Morph.prototype.backup = function (callback) {
    // in case of unsaved changes let the user confirm whether to
    // abort the operation or go ahead with it.
    // Save the current project for the currently logged in user
    // to localstorage, then perform the given callback, e.g.
    // load a new project.
    if (this.hasUnsavedEdits()) {
        this.confirm(
            'Replace the current project with a new one?',
            'Unsaved Changes!',
            () => this.backupAndDo(callback)
        );
    } else {
        callback();
    }
};

IDE_Morph.prototype.backupAndDo = function (callback) {
    // private
    var username = this.cloud.username;
    this.scene.captureGlobalSettings();
    try {
        localStorage['-snap-backup-'] = this.serializer.serialize(
            new Project(this.scenes, this.scene)
        );
        delete localStorage['-snap-bakflag-'];
        if (username) {
            localStorage['-snap-bakuser-'] = username;
        } else {
            delete localStorage['-snap-bakuser-'];
        }
        callback();
    } catch (err) {
        nop(err);
        this.confirm(
            'Backup failed. This cannot be undone, proceed anyway?',
            'Unsaved Changes!',
            callback
        );
    }
};

IDE_Morph.prototype.clearBackup = function () {
    delete localStorage['-snap-bakflag-'];
    delete localStorage['-snap-bakuser-'];
    delete localStorage['-snap-backup-'];
};

IDE_Morph.prototype.availableBackup = function (anyway) {
    // return the name of the project that can be restored in double
    // quotes for the currently logged in user.
    // Otherwise return null
    var username = this.cloud.username,
        bak, ix;
    if (this.hasLocalStorage()) {
        if (
            localStorage['-snap-bakuser-'] == username &&  // null == undefined
            (!localStorage['-snap-bakflag-'] || anyway)
        ) {
            bak = localStorage['-snap-backup-'];
            if (bak) {
                ix = bak.indexOf('"', 15);
                if (ix > 15) {
                    return bak.slice(15, ix);
                }
            }
        }
    }
    return null;
};

IDE_Morph.prototype.restore = function () {
    // load the backed up project for the currently logged in user
    // and backup the current one, in case they want to switch back to it
    var username = this.cloud.username,
        bak;
    if (this.hasLocalStorage()) {
        if (localStorage['-snap-bakuser-'] == username) { // null == undefined
            bak = localStorage['-snap-backup-'];
            if (bak) {
                this.backup(() => {
                    this.openProjectString(
                        bak,
                        () => this.recordUnsavedChanges()
                    );
                });
            }
        }
    }
};

// IDE_Morph sprite list access

IDE_Morph.prototype.addNewSprite = function () {
    var sprite = new SpriteMorph(this.globalVariables),
        rnd = Process.prototype.reportBasicRandom;

    sprite.name = this.newSpriteName(sprite.name);
    sprite.setCenter(this.stage.center());
    this.stage.add(sprite);
    sprite.fixLayout();
    sprite.rerender();

    // randomize sprite properties
    sprite.setColorDimension(0, rnd.call(this, 0, 100));
    sprite.setColorDimension(1, 100);
    sprite.setColorDimension(2, rnd.call(this, 25, 75));

    sprite.setXPosition(rnd.call(this, -220, 220));
    sprite.setYPosition(rnd.call(this, -160, 160));

    if (this.world().currentKey === 16) { // shift-click
        sprite.turn(rnd.call(this, 1, 360));
    }

    this.sprites.add(sprite);
    this.corral.addSprite(sprite);
    this.selectSprite(sprite);
};

IDE_Morph.prototype.paintNewSprite = function () {
    var sprite = new SpriteMorph(this.globalVariables),
        cos = new Costume();

    sprite.name = this.newSpriteName(sprite.name);
    sprite.setCenter(this.stage.center());
    this.stage.add(sprite);
    this.sprites.add(sprite);
    this.corral.addSprite(sprite);
    this.selectSprite(sprite);
    cos.edit(
        this.world(),
        this,
        true,
        () => this.removeSprite(sprite),
        () => {
            sprite.addCostume(cos);
            sprite.wearCostume(cos);
        }
    );
};

IDE_Morph.prototype.newCamSprite = function () {
    var sprite = new SpriteMorph(this.globalVariables),
        camDialog;

    sprite.name = this.newSpriteName(sprite.name);
    sprite.setCenter(this.stage.center());
    this.stage.add(sprite);
    this.sprites.add(sprite);
    this.corral.addSprite(sprite);
    this.selectSprite(sprite);

    camDialog = new CamSnapshotDialogMorph(
        this,
        sprite,
        () => this.removeSprite(sprite),
        function (costume) { // needs to be "function" so it can access "this"
            sprite.addCostume(costume);
            sprite.wearCostume(costume);
            this.close();
        });

    camDialog.popUp(this.world());
};

IDE_Morph.prototype.recordNewSound = function () {
    var soundRecorder;

    soundRecorder = new SoundRecorderDialogMorph(
        audio => {
            var sound;
            if (audio) {
                sound = this.currentSprite.addSound(
                	audio,
                    this.newSoundName('recording')
                );
                this.makeSureRecordingIsMono(sound);
                this.spriteBar.tabBar.tabTo('sounds');
                this.hasChangedMedia = true;
            }
        });

    soundRecorder.key = 'microphone';
    soundRecorder.popUp(this.world());
};

IDE_Morph.prototype.makeSureRecordingIsMono = function (sound) {
    // private and temporary, a horrible kludge to work around browsers'
    // reluctance to implement audio recording constraints that let us
    // record sound in mono only. As of January 2020 the audio channelCount
    // constraint only works in Firefox, hence this terrible function to
    // force convert a stereo sound to mono for Chrome.
    // If this code is still here next year, something is very wrong.
    // -Jens

    decodeSound(sound, makeMono);

    function decodeSound(sound, callback) {
        var base64, binaryString, len, bytes, i, arrayBuffer, audioCtx;
        if (sound.audioBuffer) {
            return callback (sound);
        }
        base64 = sound.audio.src.split(',')[1];
        binaryString = window.atob(base64);
        len = binaryString.length;
        bytes = new Uint8Array(len);
        for (i = 0; i < len; i += 1)        {
            bytes[i] = binaryString.charCodeAt(i);
        }
        arrayBuffer = bytes.buffer;
        audioCtx = Note.prototype.getAudioContext();
        sound.isDecoding = true;
        audioCtx.decodeAudioData(
            arrayBuffer,
            buffer => {
                sound.audioBuffer = buffer;
                return callback (sound);
            },
            err => {throw err; }
        );
    }

    function makeMono(sound) {
        var samples, audio, blob, reader;
        if (sound.audioBuffer.numberOfChannels === 1) {return; }
        samples = sound.audioBuffer.getChannelData(0);

        audio = new Audio();
        blob = new Blob(
            [
                audioBufferToWav(
                    encodeSound(samples, 44100).audioBuffer
                )
            ],
            {type: "audio/wav"}
        );
        reader = new FileReader();
        reader.onload = () => {
            audio.src = reader.result;
            sound.audio = audio; // .... aaaand we're done!
            sound.audioBuffer = null;
            sound.cachedSamples = null;
            sound.isDecoding = false;
            // console.log('made mono', sound);
        };
        reader.readAsDataURL(blob);
    }

    function encodeSound(samples, rate) {
        var ctx = Note.prototype.getAudioContext(),
            frameCount = samples.length,
            arrayBuffer = ctx.createBuffer(1, frameCount, +rate || 44100),
            i,
            source;

        if (!arrayBuffer.copyToChannel) {
            arrayBuffer.copyToChannel = function (src, channel) {
                var buffer = this.getChannelData(channel);
                for (i = 0; i < src.length; i += 1) {
                    buffer[i] = src[i];
                }
            };
        }
        arrayBuffer.copyToChannel(
            Float32Array.from(samples),
            0,
            0
        );
        source = ctx.createBufferSource();
        source.buffer = arrayBuffer;
        source.audioBuffer = source.buffer;
        return source;
    }

    function audioBufferToWav(buffer, opt) {
        var sampleRate = buffer.sampleRate,
            format = (opt || {}).float32 ? 3 : 1,
            bitDepth = format === 3 ? 32 : 16,
            result;

        result = buffer.getChannelData(0);
        return encodeWAV(result, format, sampleRate, 1, bitDepth);
    }

    function encodeWAV(
        samples,
        format,
        sampleRate,
        numChannels,
        bitDepth
    ) {
        var bytesPerSample = bitDepth / 8,
            blockAlign = numChannels * bytesPerSample,
            buffer = new ArrayBuffer(44 + samples.length * bytesPerSample),
            view = new DataView(buffer);

        function writeFloat32(output, offset, input) {
            for (var i = 0; i < input.length; i += 1, offset += 4) {
                output.setFloat32(offset, input[i], true);
            }
        }

        function floatTo16BitPCM(output, offset, input) {
            var i, s;
            for (i = 0; i < input.length; i += 1, offset += 2) {
                s = Math.max(-1, Math.min(1, input[i]));
                output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            }
        }

        function writeString(view, offset, string) {
            for (var i = 0; i < string.length; i += 1) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        }

        writeString(view, 0, 'RIFF'); // RIFF identifier
        // RIFF chunk length:
        view.setUint32(4, 36 + samples.length * bytesPerSample, true);
        writeString(view, 8, 'WAVE'); // RIFF type
        writeString(view, 12, 'fmt '); // format chunk identifier
        view.setUint32(16, 16, true); // format chunk length
        view.setUint16(20, format, true); // sample format (raw)
        view.setUint16(22, numChannels, true); // channel count
        view.setUint32(24, sampleRate, true); // sample rate
        // byte rate (sample rate * block align):
        view.setUint32(28, sampleRate * blockAlign, true);
        // block align (channel count * bytes per sample):
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitDepth, true); // bits per sample
        writeString(view, 36, 'data'); // data chunk identifier
        // data chunk length:
        view.setUint32(40, samples.length * bytesPerSample, true);
        if (format === 1) { // Raw PCM
            floatTo16BitPCM(view, 44, samples);
        } else {
            writeFloat32(view, 44, samples);
        }
        return buffer;
    }
};

IDE_Morph.prototype.duplicateSprite = function (sprite) {
    var duplicate = sprite.fullCopy();
    duplicate.isDown = false;
    duplicate.setPosition(this.world().hand.position());
    duplicate.appearIn(this);
    duplicate.keepWithin(this.stage);
    duplicate.isDown = sprite.isDown;
    this.selectSprite(duplicate);
    duplicate.recordUserEdit(
        'corral',
        'duplicate',
        sprite.name
    );
};

IDE_Morph.prototype.instantiateSprite = function (sprite) {
    var instance = sprite.fullCopy(true),
        hats = instance.allHatBlocksFor('__clone__init__');
    instance.isDown = false;
    instance.appearIn(this);
    if (hats.length) {
        instance.initClone(hats);
    } else {
        instance.setPosition(this.world().hand.position());
        instance.keepWithin(this.stage);
    }
    instance.isDown = sprite.isDown;
    this.selectSprite(instance);
    instance.recordUserEdit(
        'corral',
        'clone',
        sprite.name
    );
};

IDE_Morph.prototype.removeSprite = function (sprite, enableUndelete = true) {
    var idx;
    sprite.parts.slice().forEach(part =>
    	this.removeSprite(part)
    );
    idx = this.sprites.asArray().indexOf(sprite) + 1;
    this.stage.threads.stopAllForReceiver(sprite);
    sprite.recordUserEdit(
        'corral',
        'delete',
        sprite.name
    );
    sprite.corpsify();
    sprite.destroy();
    this.stage.watchers().forEach(watcher => {
        if (watcher.object() === sprite) {
            watcher.destroy();
        }
    });
    if (idx > 0) {
        this.sprites.remove(idx);
    }
    this.createCorral(true); // keep scenes
    this.fixLayout();
    this.currentSprite = detect(
        this.stage.children,
        morph => morph instanceof SpriteMorph && !morph.isTemporary
    ) || this.stage;

    this.selectSprite(this.currentSprite);

    // remember the deleted sprite so it can be recovered again later
    if (enableUndelete) {
        this.scene.trash.push(sprite);
    }
};

IDE_Morph.prototype.newSoundName = function (name) {
    var lastSound = this.currentSprite.sounds.at(
            this.currentSprite.sounds.length()
        );

    return this.newName(
        name || lastSound.name,
        this.currentSprite.sounds.asArray().map(eachSound =>
            eachSound.name
        )
    );
};

IDE_Morph.prototype.newSpriteName = function (name, ignoredSprite) {
    var all = this.sprites.asArray().concat(this.stage).filter(each =>
            each !== ignoredSprite
        ).map(each => each.name);
    return this.newName(name, all);
};

IDE_Morph.prototype.newSceneName = function (name, ignoredScene) {
    var sName = name.replace(/['"]/g, ''), // filter out quotation marks
        all = this.scenes.asArray().filter(each =>
            each !== ignoredScene
        ).map(each => each.name);
    return this.newName(sName, all);
};

IDE_Morph.prototype.newName = function (name, elements) {
    var count = 1,
        newName = name,
        exist = e => snapEquals(e, newName);

    while (elements.some(exist)) {
        count += 1;
        newName = name + '(' + count + ')';
    }
    return newName;
};

// IDE_Morph identifying sprites by name

IDE_Morph.prototype.spriteNamed = function (name) {
    // answer the SnapObject (sprite or stage) indicated by its name
    // or the currently edited object if no name is given or none is found
    var match;
    if (name === this.stage.name) {
        return this.stage;
    }
    match = detect(
        this.sprites,
        sprite => sprite.name === name
    );
    if (!match) {
        // check if the sprite in question is currently being
        // dragged around
        match = detect(
            this.world().hand.children,
            morph => morph instanceof SpriteMorph && morph.name === name
        );
    }
    return match || this.currentSprite;
};

// IDE_Morph deleting scripts

IDE_Morph.prototype.removeBlock = function (aBlock, justThis) {
    this.stage.threads.stopAllForBlock(aBlock);
    aBlock.destroy(justThis);
};

// IDE_Morph menus

IDE_Morph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    // menu.addItem('help', 'nop');
    return menu;
};

IDE_Morph.prototype.snapMenu = function () {
    var menu,
        world = this.world();

    menu = new MenuMorph(this);
    menu.addItem('About...', 'aboutSnap');
    menu.addLine();
    menu.addItem(
        'Reference manual',
        () => {
            var url = this.resourceURL('help', 'SnapManual.pdf');
            window.open(url, 'SnapReferenceManual');
        }
    );
    menu.addItem(
        'Snap! website',
        () => window.open('https://snap.berkeley.edu/', 'SnapWebsite')
    );
    menu.addItem(
        'Download source',
        () => window.open(
                'https://github.com/jmoenig/Snap/releases/latest',
                'SnapSource'
            )
    );
    if (world.isDevMode) {
        menu.addLine();
        menu.addItem(
            'Switch back to user mode',
            'switchToUserMode',
            'disable deep-Morphic\ncontext menus'
                + '\nand show user-friendly ones',
            new Color(0, 100, 0)
        );
    } else if (world.currentKey === 16) { // shift-click
        menu.addLine();
        menu.addItem(
            'Switch to dev mode',
            'switchToDevMode',
            'enable Morphic\ncontext menus\nand inspectors,'
                + '\nnot user-friendly!',
            new Color(100, 0, 0)
        );
    }
    menu.popup(world, this.logo.bottomLeft());
};

IDE_Morph.prototype.cloudMenu = function () {
    var menu,
        world = this.world(),
        pos = this.controlBar.cloudButton.bottomLeft(),
        shiftClicked = (world.currentKey === 16);

    if (location.protocol === 'file:' && !shiftClicked) {
        this.showMessage('cloud unavailable without a web server.');
        return;
    }

    menu = new MenuMorph(this);
    if (shiftClicked) {
        menu.addItem(
            'url...',
            'setCloudURL',
            null,
            new Color(100, 0, 0)
        );
        menu.addLine();
    }
    if (!this.cloud.username) {
        menu.addItem(
            'Login...',
            'initializeCloud'
        );
        menu.addItem(
            'Signup...',
            'createCloudAccount'
        );
        menu.addItem(
            'Reset Password...',
            'resetCloudPassword'
        );
        menu.addItem(
            'Resend Verification Email...',
            'resendVerification'
        );
    } else {
        menu.addItem(
            localize('Logout') + ' ' + this.cloud.username,
            'logout'
        );
        menu.addItem(
            'Change Password...',
            'changeCloudPassword'
        );
    }
    if (this.hasCloudProject()) {
        menu.addLine();
        menu.addItem(
            'Open in Community Site',
            () => {
                var dict = this.urlParameters();
                window.open(
                    this.cloud.showProjectPath(
                        dict.Username, dict.ProjectName
                    ),
                    '_blank'
                );
            }
        );
    }
    if (shiftClicked) {
        menu.addLine();
        menu.addItem(
            'export project media only...',
            () => {
                var pn = this.getProjectName();
                if (pn) {
                    this.exportProjectMedia(pn);
                } else {
                    this.prompt(
                        'Export Project As...',
                        name => this.exportProjectMedia(name),
                        null,
                        'exportProject'
                    );
                }
            },
            null,
            this.hasChangedMedia ? new Color(100, 0, 0) : new Color(0, 100, 0)
        );
        menu.addItem(
            'export project without media...',
            () => {
                var pn = this.getProjectName();
                if (pn) {
                    this.exportProjectNoMedia(pn);
                } else {
                    this.prompt(
                        'Export Project As...',
                        name => this.exportProjectNoMedia(name),
                        null,
                        'exportProject'
                    );
                }
            },
            null,
            new Color(100, 0, 0)
        );
        menu.addItem(
            'export project as cloud data...',
            () => {
                var pn = this.getProjectName();
                if (pn) {
                    this.exportProjectAsCloudData(pn);
                } else {
                    this.prompt(
                        'Export Project As...',
                        name => this.exportProjectAsCloudData(name),
                        null,
                        'exportProject'
                    );
                }
            },
            null,
            new Color(100, 0, 0)
        );
        menu.addLine();
        menu.addItem(
            'open shared project from cloud...',
            () => {
                this.prompt(
                    'Author name…',
                    usr => {
                        this.prompt(
                            'Project name...',
                            prj => {
                                this.showMessage(
                                    'Fetching project\nfrom the cloud...'
                                );
                                this.cloud.getPublicProject(
                                    prj,
                                    usr.toLowerCase(),
                                    projectData => {
                                        var msg;
                                        if (
                                            !Process.prototype.isCatchingErrors
                                        ) {
                                            window.open(
                                                'data:text/xml,' + projectData
                                            );
                                        }
                                    this.nextSteps([
                                        () => {
                                            msg = this.showMessage(
                                                'Opening project...'
                                            );
                                        },
                                        () => {
                                            this.rawOpenCloudDataString(
                                                projectData
                                            );
                                            msg.destroy();
                                        },
                                    ]);
                                },
                                this.cloudError()
                            );
                        },
                        null,
                        'project'
                    );
                },
                null,
                'project'
                );
            },
            null,
            new Color(100, 0, 0)
        );
    }
    menu.popup(world, pos);
};

IDE_Morph.prototype.settingsMenu = function () {
    var menu,
        stage = this.stage,
        world = this.world(),
        pos = this.controlBar.settingsButton.bottomLeft(),
        shiftClicked = (world.currentKey === 16),
        on = new SymbolMorph(
            'checkedBox',
            MorphicPreferences.menuFontSize * 0.75
        ),
        off = new SymbolMorph(
            'rectangle',
            MorphicPreferences.menuFontSize * 0.75
        );

    function addPreference(label, toggle, test, onHint, offHint, hide) {
        if (!hide || shiftClicked) {
            menu.addItem(
                [
                    (test? on : off),
                    localize(label)
                ],
                toggle,
                test ? onHint : offHint,
                hide ? new Color(100, 0, 0) : null
            );
        }
    }

    function addSubPreference(label, toggle, test, onHint, offHint, hide) {
        if (!hide || shiftClicked) {
            menu.addItem(
                [
                    (test? on : off),
                    '  ' + localize(label)
                ],
                toggle,
                test ? onHint : offHint,
                hide ? new Color(100, 0, 0) : null
            );
        }
    }

    menu = new MenuMorph(this);
    menu.addPair(
        [
            new SymbolMorph(
                'globe',
                MorphicPreferences.menuFontSize
            ),
            localize('Language...')
        ],
        'languageMenu'
    );
    menu.addItem(
        localize('Looks') + '...',
        'looksMenu'
    );
    menu.addItem(
        'Zoom blocks...',
        'userSetBlocksScale'
    );
    menu.addItem(
        'Fade blocks...',
        'userFadeBlocks'
    );
    menu.addItem(
        'Afterglow blocks...',
        'userSetBlocksAfterglow'
    );
    menu.addItem(
        'Stage size...',
        'userSetStageSize'
    );
    if (shiftClicked) {
        menu.addItem(
            'Dragging threshold...',
            'userSetDragThreshold',
            'specify the distance the hand has to move\n' +
                'before it picks up an object',
            new Color(100, 0, 0)
        );
    }
    menu.addItem(
        'Microphone resolution...',
        'microphoneMenu'
    );
    menu.addLine();
    if (shiftClicked) {
        menu.addItem(
            'Primitives palette',
            () => this.stage.restorePrimitives(),
            'EXPERIMENTAL - switch (back) to\n' +
                'primitive blocks in the palette',
            new Color(100, 0, 0)
        );
        menu.addItem(
            'Customize primitives',
            () => this.stage.customizeBlocks(),
            'EXPERIMENTAL - overload primitives\n' +
                'with custom block definitions',
            new Color(100, 0, 0)
        );
        menu.addLine();
        addPreference(
            'Blocks all the way',
            () => {
                if (SpriteMorph.prototype.isBlocksAllTheWay()) {
                    this.stage.restorePrimitives();
                } else {
                    this.bootstrapCustomizedPrimitives(
                        this.stage.customizeBlocks()
                    );
                }
            },
            SpriteMorph.prototype.isBlocksAllTheWay(),
            'uncheck to disable editing primitives\n' +
                'in the palette as custom blocks',
            'check to edit primitives\nin the palette as custom blocks',
            new Color(100, 0, 0)

        );
        if (SpriteMorph.prototype.hasCustomizedPrimitives()) {
            menu.addItem(
                'Use custom blocks',
                () => SpriteMorph.prototype.toggleAllCustomizedPrimitives(
                    this.stage,
                    false
                ),
                'EXPERIMENTAL - use custom blocks\n' +
                    'in all palette blocks',
                new Color(100, 0, 0)
            );
            menu.addItem(
                'Use primitives',
                () => SpriteMorph.prototype.toggleAllCustomizedPrimitives(
                    this.stage,
                    true
                ),
                'EXPERIMENTAL - use primitives\n' +
                    'in all palette blocks',
                new Color(100, 0, 0)
            );
            menu.addLine();
        }
    }
    addPreference(
        'JavaScript extensions',
        () => {
            /*
            if (!Process.prototype.enableJS) {
                this.logout();
            }
            */
            Process.prototype.enableJS = !Process.prototype.enableJS;
            if (Process.prototype.enableJS) {
                // show JS-func primitive in case a microworld hides it
                delete StageMorph.prototype.hiddenPrimitives.reportJSFunction;
            }
            this.flushBlocksCache('operators');
            this.refreshPalette();
            this.categories.refreshEmpty();
        },
        Process.prototype.enableJS,
        'uncheck to disable support for\nnative JavaScript functions',
        'check to support\nnative JavaScript functions' /* +
            '.\n' +
            'NOTE: You will have to manually\n' +
            'sign in again to access your account.' */
    );
    addPreference(
        'Extension blocks',
        () => {
            SpriteMorph.prototype.showingExtensions =
                !SpriteMorph.prototype.showingExtensions;
            this.flushBlocksCache('variables');
            this.refreshPalette();
            this.categories.refreshEmpty();
        },
        SpriteMorph.prototype.showingExtensions,
        'uncheck to hide extension\nprimitives in the palette',
        'check to show extension\nprimitives in the palette'
    );
    /*
    addPreference(
        'Add scenes',
        () => this.isAddingScenes = !this.isAddingScenes,
        this.isAddingScenes,
        'uncheck to replace the current project,\nwith a new one',
        'check to add other projects,\nto this one',
        true
    );
    */
    if (isRetinaSupported()) {
        addPreference(
            'Retina display support',
            'toggleRetina',
            isRetinaEnabled(),
            'uncheck for lower resolution,\nsaves computing resources',
            'check for higher resolution,\nuses more computing resources',
            true
        );
    }
    addPreference(
        'Input sliders',
        'toggleInputSliders',
        MorphicPreferences.useSliderForInput,
        'uncheck to disable\ninput sliders for\nentry fields',
        'check to enable\ninput sliders for\nentry fields'
    );
    if (MorphicPreferences.useSliderForInput) {
        addSubPreference(
            'Execute on slider change',
            'toggleSliderExecute',
            ArgMorph.prototype.executeOnSliderEdit,
            'uncheck to suppress\nrunning scripts\nwhen moving the slider',
            'check to run\nthe edited script\nwhen moving the slider'
        );
    }
    addPreference(
        'Turbo mode',
        'toggleFastTracking',
        this.stage.isFastTracked,
        'uncheck to run scripts\nat normal speed',
        'check to prioritize\nscript execution'
    );
    addPreference(
        'Visible stepping',
        'toggleSingleStepping',
        Process.prototype.enableSingleStepping,
        'uncheck to turn off\nvisible stepping',
        'check to turn on\n visible stepping (slow)',
        false
    );
    addPreference(
        'Log pen vectors',
        () => StageMorph.prototype.enablePenLogging =
            !StageMorph.prototype.enablePenLogging,
        StageMorph.prototype.enablePenLogging,
        'uncheck to turn off\nlogging pen vectors',
        'check to turn on\nlogging pen vectors',
        false
    );
    addPreference(
        'Case sensitivity',
        () => Process.prototype.isCaseInsensitive =
            !Process.prototype.isCaseInsensitive,
        !Process.prototype.isCaseInsensitive,
        'uncheck to ignore upper- and\n lowercase when comparing texts',
        'check to distinguish upper- and\n lowercase when comparing texts',
        false
    );
    addPreference(
        'Ternary Boolean slots',
        () => BooleanSlotMorph.prototype.isTernary =
            !BooleanSlotMorph.prototype.isTernary,
        BooleanSlotMorph.prototype.isTernary,
        'uncheck to limit\nBoolean slots to true / false',
        'check to allow\nempty Boolean slots',
        true
    );
    addPreference(
        'Camera support',
        'toggleCameraSupport',
        CamSnapshotDialogMorph.prototype.enableCamera,
        'uncheck to disable\ncamera support',
        'check to enable\ncamera support',
        true
    );
    addPreference(
        'Dynamic sprite rendering',
        () => SpriteMorph.prototype.isCachingImage =
            !SpriteMorph.prototype.isCachingImage,
        !SpriteMorph.prototype.isCachingImage,
        'uncheck to render\nsprites dynamically',
        'check to cache\nsprite renderings',
        true
    );
    addPreference(
        'Dynamic scheduling',
        () => StageMorph.prototype.enableQuicksteps =
            !StageMorph.prototype.enableQuicksteps,
        StageMorph.prototype.enableQuicksteps,
        'uncheck to schedule\nthreads framewise',
        'check to quickstep\nthreads atomically',
        true
    );
    addPreference(
        'Performer mode',
        () => this.togglePerformerMode(),
        this.performerMode,
        'uncheck to go back to regular\nlayout',
        'check to have the stage use up\nall space and go behind the\n' +
        'scripting area'
    );
    menu.addLine(); // everything visible below is persistent
    addPreference(
        'Blurred shadows',
        'toggleBlurredShadows',
        useBlurredShadows,
        'uncheck to use solid drop\nshadows and highlights',
        'check to use blurred drop\nshadows and highlights',
        true
    );
    addPreference(
        'Zebra coloring',
        'toggleZebraColoring',
        BlockMorph.prototype.zebraContrast,
        'uncheck to disable alternating\ncolors for nested block',
        'check to enable alternating\ncolors for nested blocks',
        true
    );
    addPreference(
        'Dynamic input labels',
        'toggleDynamicInputLabels',
        SyntaxElementMorph.prototype.dynamicInputLabels,
        'uncheck to disable dynamic\nlabels for variadic inputs',
        'check to enable dynamic\nlabels for variadic inputs',
        true
    );
    addPreference(
        'Prefer empty slot drops',
        'togglePreferEmptySlotDrops',
        ScriptsMorph.prototype.isPreferringEmptySlots,
        'uncheck to allow dropped\nreporters to kick out others',
        'settings menu prefer empty slots hint',
        true
    );
    addPreference(
        'Long form input dialog',
        'toggleLongFormInputDialog',
        InputSlotDialogMorph.prototype.isLaunchingExpanded,
        'uncheck to use the input\ndialog in short form',
        'check to always show slot\ntypes in the input dialog'
    );
    addPreference(
        'Plain prototype labels',
        'togglePlainPrototypeLabels',
        BlockLabelPlaceHolderMorph.prototype.plainLabel,
        'uncheck to always show (+) symbols\nin block prototype labels',
        'check to hide (+) symbols\nin block prototype labels'
    );
    addPreference(
        'Clicking sound',
        () => {
            BlockMorph.prototype.toggleSnapSound();
            if (BlockMorph.prototype.snapSound) {
                this.saveSetting('click', true);
            } else {
                this.removeSetting('click');
            }
        },
        BlockMorph.prototype.snapSound,
        'uncheck to turn\nblock clicking\nsound off',
        'check to turn\nblock clicking\nsound on'
    );
    addPreference(
        'Animations',
        () => this.isAnimating = !this.isAnimating,
        this.isAnimating,
        'uncheck to disable\nIDE animations',
        'check to enable\nIDE animations',
        true
    );
    /*
    addPreference(
        'Cache Inputs',
        () => {
            BlockMorph.prototype.isCachingInputs =
                !BlockMorph.prototype.isCachingInputs;
        },
        BlockMorph.prototype.isCachingInputs,
        'uncheck to stop caching\ninputs (for debugging the evaluator)',
        'check to cache inputs\nboosts recursion',
        true
    );
    */
    addPreference(
        'Rasterize SVGs',
        () => MorphicPreferences.rasterizeSVGs =
            !MorphicPreferences.rasterizeSVGs,
        MorphicPreferences.rasterizeSVGs,
        'uncheck for smooth\nscaling of vector costumes',
        'check to rasterize\nSVGs on import',
        true
    );
    addPreference(
        'Nested auto-wrapping',
        () => {
            ScriptsMorph.prototype.enableNestedAutoWrapping =
                !ScriptsMorph.prototype.enableNestedAutoWrapping;
            if (ScriptsMorph.prototype.enableNestedAutoWrapping) {
                this.removeSetting('autowrapping');
            } else {
                this.saveSetting('autowrapping', false);
            }
        },
        ScriptsMorph.prototype.enableNestedAutoWrapping,
        'uncheck to confine auto-wrapping\nto top-level block stacks',
        'check to enable auto-wrapping\ninside nested block stacks',
        true
    );
    addPreference(
        'Sprite Nesting',
        () => SpriteMorph.prototype.enableNesting =
            !SpriteMorph.prototype.enableNesting,
        SpriteMorph.prototype.enableNesting,
        'uncheck to disable\nsprite composition',
        'check to enable\nsprite composition',
        true
    );
    addPreference(
        'First-Class Sprites',
        () => {
            SpriteMorph.prototype.enableFirstClass =
                !SpriteMorph.prototype.enableFirstClass;
            this.flushBlocksCache('sensing');
            this.refreshPalette();
            this.categories.refreshEmpty();
        },
        SpriteMorph.prototype.enableFirstClass,
        'uncheck to disable support\nfor first-class sprites',
        'check to enable support\n for first-class sprite',
        true
    );
    addPreference(
        'Keyboard Editing',
        () => {
            ScriptsMorph.prototype.enableKeyboard =
                !ScriptsMorph.prototype.enableKeyboard;
            this.currentSprite.scripts.updateToolbar();
            if (ScriptsMorph.prototype.enableKeyboard) {
                this.removeSetting('keyboard');
            } else {
                this.saveSetting('keyboard', false);
            }
        },
        ScriptsMorph.prototype.enableKeyboard,
        'uncheck to disable\nkeyboard editing support',
        'check to enable\nkeyboard editing support',
        true
    );
    addPreference(
        'Table support',
        () => {
            List.prototype.enableTables =
                !List.prototype.enableTables;
            if (List.prototype.enableTables) {
                this.removeSetting('tables');
            } else {
                this.saveSetting('tables', false);
            }
        },
        List.prototype.enableTables,
        'uncheck to disable\nmulti-column list views',
        'check for multi-column\nlist view support',
        true
    );
    if (List.prototype.enableTables) {
        addPreference(
            'Table lines',
            () => {
                TableMorph.prototype.highContrast =
                    !TableMorph.prototype.highContrast;
                if (TableMorph.prototype.highContrast) {
                    this.saveSetting('tableLines', true);
                } else {
                    this.removeSetting('tableLines');
                }
            },
            TableMorph.prototype.highContrast,
            'uncheck for less contrast\nmulti-column list views',
            'check for higher contrast\ntable views',
            true
        );
    }
    addPreference(
        'Live coding support',
        () => Process.prototype.enableLiveCoding =
            !Process.prototype.enableLiveCoding,
        Process.prototype.enableLiveCoding,
        'EXPERIMENTAL! uncheck to disable live\ncustom control structures',
        'EXPERIMENTAL! check to enable\n live custom control structures',
        true
    );
    addPreference(
        'JIT compiler support',
        () => {
            Process.prototype.enableCompiling =
                !Process.prototype.enableCompiling;
            this.flushBlocksCache('operators');
            this.refreshPalette();
            this.categories.refreshEmpty();
        },
        Process.prototype.enableCompiling,
        'EXPERIMENTAL! uncheck to disable live\nsupport for compiling',
        'EXPERIMENTAL! check to enable\nsupport for compiling',
        true
    );
    menu.addLine(); // everything below this line is stored in the project
    addPreference(
        'Thread safe scripts',
        () => stage.isThreadSafe = !stage.isThreadSafe,
        this.stage.isThreadSafe,
        'uncheck to allow\nscript reentrance',
        'check to disallow\nscript reentrance'
    );
    addPreference(
        'Flat line ends',
        () => SpriteMorph.prototype.useFlatLineEnds =
            !SpriteMorph.prototype.useFlatLineEnds,
        SpriteMorph.prototype.useFlatLineEnds,
        'uncheck for round ends of lines',
        'check for flat ends of lines'
    );
    addPreference(
        'Codification support',
        () => {
            StageMorph.prototype.enableCodeMapping =
                !StageMorph.prototype.enableCodeMapping;
            this.flushBlocksCache('variables');
            this.refreshPalette();
            this.categories.refreshEmpty();
        },
        StageMorph.prototype.enableCodeMapping,
        'uncheck to disable\nblock to text mapping features',
        'check for block\nto text mapping features',
        false
    );
    addPreference(
        'Inheritance support',
        () => {
            StageMorph.prototype.enableInheritance =
                !StageMorph.prototype.enableInheritance;
            this.flushBlocksCache('variables');
            this.refreshPalette();
            this.categories.refreshEmpty();
        },
        StageMorph.prototype.enableInheritance,
        'uncheck to disable\nsprite inheritance features',
        'check for sprite\ninheritance features',
        true
    );
    addPreference(
        'Hyper blocks support',
        () => Process.prototype.enableHyperOps =
            !Process.prototype.enableHyperOps,
        Process.prototype.enableHyperOps,
        'uncheck to disable\nusing operators on lists and tables',
        'check to enable\nusing operators on lists and tables',
        true
    );
    addPreference(
        'Single palette',
        () => this.toggleUnifiedPalette(),
        this.scene.unifiedPalette,
        'uncheck to show only the selected category\'s blocks',
        'check to show all blocks in a single palette',
        false
    );
    if (this.scene.unifiedPalette) {
        addSubPreference(
            'Show categories',
            () => this.toggleCategoryNames(),
            this.scene.showCategories,
            'uncheck to hide\ncategory names\nin the palette',
            'check to show\ncategory names\nin the palette'
        );
        addSubPreference(
            'Show buttons',
            () => this.togglePaletteButtons(),
            this.scene.showPaletteButtons,
            'uncheck to hide buttons\nin the palette',
            'check to show buttons\nin the palette'
        );
    }
    addPreference(
        'Wrap list indices',
        () => {
            List.prototype.enableWrapping =
                !List.prototype.enableWrapping;
        },
        List.prototype.enableWrapping,
        'uncheck to disable\nwrapping list indices',
        'check for wrapping\nlist indices',
        true
    );
    addPreference(
        'Persist linked sublist IDs',
        () => StageMorph.prototype.enableSublistIDs =
            !StageMorph.prototype.enableSublistIDs,
        StageMorph.prototype.enableSublistIDs,
        'uncheck to disable\nsaving linked sublist identities',
        'check to enable\nsaving linked sublist identities',
        true
    );
    addPreference(
        'Enable command drops in all rings',
        () => RingReporterSlotMorph.prototype.enableCommandDrops =
            !RingReporterSlotMorph.prototype.enableCommandDrops,
        RingReporterSlotMorph.prototype.enableCommandDrops,
        'uncheck to disable\ndropping commands in reporter rings',
        'check to enable\ndropping commands in all rings',
        true
    );

    addPreference(
        'HSL pen color model',
        () => {
            SpriteMorph.prototype.penColorModel =
                SpriteMorph.prototype.penColorModel === 'hsl' ? 'hsv' : 'hsl';
            this.refreshIDE();
        },
        SpriteMorph.prototype.penColorModel === 'hsl',
        'uncheck to switch pen colors\nand graphic effects to HSV',
        'check to switch pen colors\nand graphic effects to HSL',
        false
    );

    addPreference(
        'Disable click-to-run',
        () => ThreadManager.prototype.disableClickToRun =
            !ThreadManager.prototype.disableClickToRun,
        ThreadManager.prototype.disableClickToRun,
        'uncheck to enable\ndirectly running blocks\nby clicking on them',
        'check to disable\ndirectly running blocks\nby clicking on them',
        false
    );
    addPreference(
        'Disable dragging data',
        () => SpriteMorph.prototype.disableDraggingData =
            !SpriteMorph.prototype.disableDraggingData,
        SpriteMorph.prototype.disableDraggingData,
        'uncheck to drag media\nand blocks out of\nwatchers and balloons',
        'disable dragging media\nand blocks out of\nwatchers and balloons',
        false
    );
    menu.popup(world, pos);
};

IDE_Morph.prototype.bootstrapCustomizedPrimitives = function (skipped) {
    SpriteMorph.prototype.bootstrapCustomizedPrimitives(this.stage, skipped);
};

IDE_Morph.prototype.projectMenu = function () {
    var menu, tm,
        world = this.world(),
        pos = this.controlBar.projectButton.bottomLeft(),
        graphicsName = this.currentSprite instanceof SpriteMorph ?
                'Costumes' : 'Backgrounds',
        shiftClicked = (world.currentKey === 16),
        backup = this.availableBackup(shiftClicked);

    menu = new MenuMorph(this);
    menu.addItem('Notes...', 'editNotes');
    menu.addLine();
    if (!this.config.noProjectItems) {
        menu.addPair('New', 'createNewProject', '^N');
        menu.addPair('Open...', 'openProjectsBrowser', '^O');
        menu.addPair('Save', "save", '^S');
        menu.addItem('Save As...', 'saveProjectsBrowser');
        if (backup) {
            menu.addItem(
                'Restore unsaved project',
                'restore',
                backup,
                shiftClicked ? new Color(100, 0, 0) : null
            );
            if (shiftClicked) {
                menu.addItem(
                    'Clear backup',
                    'clearBackup',
                    backup,
                    new Color(100, 0, 0)
                );
            }
        }
        menu.addLine();
        menu.addItem(
            'Import...',
            'importLocalFile',
            'file menu import hint'
                // looks up the actual text in the translator
        );
        menu.addItem(
            'Export project...',
            () => {
                var pn = this.getProjectName();
                if (pn) {
                    this.exportProject(pn);
                } else {
                    this.prompt(
                        'Export Project As...',
                        name => this.exportProject(name),
                        null,
                        'exportProject'
                    );
                }
            },
            'save project data as XML\nto your downloads folder'
        );
        menu.addItem(
            'Export summary...',
            () => this.exportProjectSummary(),
            'save a summary\nof this project'
        );
        if (shiftClicked) {
            menu.addItem(
                'Export summary with drop-shadows...',
                () => this.exportProjectSummary(true),
                'download and save' +
                    '\nwith a summary of this project' +
                    '\nwith drop-shadows on all pictures.' +
                    '\nnot supported by all browsers',
                new Color(100, 0, 0)
            );
            menu.addItem(
                'Export all scripts as pic...',
                () => this.exportScriptsPicture(),
                'show a picture of all scripts\nand block definitions',
                new Color(100, 0, 0)
            );
        }
        if (this.stage.trailsLog.length) {
            tm = new MenuMorph(this);
            tm.addItem(
                'png...',
                () => this.saveCanvasAs(
                    this.currentSprite.reportPenTrailsAsCostume().contents,
                    this.getProjectName() || this.stage.name
                ),
                'export pen trails\nas PNG image'
            );
            tm.addItem(
                'svg...',
                () => this.stage.exportTrailsLogAsSVG(),
                'export pen trails\nline segments as SVG'
            );
            tm.addItem(
                'poly svg...',
                () => this.stage.exportTrailsLogAsPolySVG(),
                'export pen trails\nline segments as polyline SVG'
            );
            tm.addItem(
                'dst...',
                () => this.stage.exportTrailsLogAsDST(),
                'export pen trails\nas DST embroidery file'
            );
            tm.addItem(
                'exp...',
                () => this.stage.exportTrailsLogAsEXP(),
                'export pen trails\nas EXP embroidery file'
            );
            menu.addMenu('Export pen trails', tm);
        } else {
            menu.addItem(
                'Export pen trails...',
                () => this.saveCanvasAs(
                    this.currentSprite.reportPenTrailsAsCostume().contents,
                    this.getProjectName() || this.stage.name
                ),
                'export pen trails\nas PNG image'
            );
        }
        menu.addLine();
        if (this.stage.globalBlocks.length ||
            SpriteMorph.prototype.hasCustomizedPrimitives()
        ) {
            menu.addItem(
                'Export blocks...',
                () => this.exportGlobalBlocks(),
                'save global custom block\ndefinitions as XML'
            );
        }
        if (this.stage.globalBlocks.length) {
            menu.addItem(
                'Unused blocks...',
                () => this.removeUnusedBlocks(),
                'find unused global custom blocks' +
                    '\nand remove their definitions'
            );
        }
        if (SpriteMorph.prototype.hasCustomizedPrimitives()) {
            if (shiftClicked) {
                menu.addItem(
                    'Export customized primitives...',
                    () => this.exportCustomizedPrimitives(),
                    'EXPERIMENTAL!',
                    new Color(100, 0, 0)
                );
            }
            menu.addItem(
                'Restore primitives',
                () => this.stage.restorePrimitives(),
                'switch (back) to primitive blocks in the palette,\n' +
                    'CAUTION - can break extensions.'
            );
        }
        menu.addItem(
            'Hide blocks...',
            () => new BlockVisibilityDialogMorph(
                    this.currentSprite
                ).popUp(world)
        );
        menu.addItem(
            'New category...',
            () => this.createNewCategory()
        );
        if (SpriteMorph.prototype.customCategories.size) {
            menu.addItem(
                'Remove a category...',
                () => this.deleteUserCategory(pos)
            );
        }
        if (this.currentSprite instanceof SpriteMorph &&
            !this.currentSprite.solution) {
            menu.addItem(
                'Generate puzzle',
                'generatePuzzle',
                'generate a Parson\'s Puzzle\n' +
                    'from the current sprite'
            );
        }
        menu.addLine();
        if (this.scenes.length() > 1) {
            menu.addItem('Scenes...', 'scenesMenu');
        }
        menu.addPair('New scene', 'createNewScene');
        menu.addPair('Add scene...', 'addScene');
        menu.addLine();
    }
    menu.addItem(
        'Libraries...',
        () => {
            if (location.protocol === 'file:') {
                this.importLocalFile();
                return;
            }
            this.getURL(
                this.resourceURL('libraries', 'LIBRARIES.json'),
                txt => {
                    var libraries = this.parseResourceFile(txt);
                    new LibraryImportDialogMorph(this, libraries).popUp();
                }
            );
        },
        'Select categories of additional blocks to add to this project.'
    );
    menu.addItem(
        localize(graphicsName) + '...',
        () => {
            if (location.protocol === 'file:') {
                this.importLocalFile();
                return;
            }
            this.importMedia(graphicsName);
        },
        'Select a costume from the media library'
    );
    menu.addItem(
        localize('Sounds') + '...',
        () => {
            if (location.protocol === 'file:') {
                this.importLocalFile();
                return;
            }
            this.importMedia('Sounds');
        },
        'Select a sound from the media library'
    );

    if (this.scene.trash.length) {
        menu.addLine();
        menu.addItem(
            'Undelete sprites...',
            () => this.undeleteSprites(
                this.controlBar.projectButton.bottomLeft()
            ),
            'Bring back deleted sprites'
        );
    }
    menu.popup(world, pos);
};

IDE_Morph.prototype.resourceURL = function () {
    // Take in variadic inputs that represent an a nested folder structure.
    // Method can be easily overridden if running in a custom location.
    // Default Snap! simply returns a path (relative to snap.html)
    // Note: You can specify a base path to the root directory in the
    // configuration object's "path" property that's passed when creating
    // an IDE instance, e.g. either a relative one: {path: '../' }
    // or a full url, depending on where (your) Snap! distro ist hosted
    var args = Array.prototype.slice.call(arguments, 0),
        path = this.config.path ? [this.config.path] : [];
    return path.concat(args).join('/');
};

IDE_Morph.prototype.getMediaList = function (dirname, callback) {
    // Invoke the given callback with a list of files in a directory
    // based on the contents file.
    // If no callback is specified, synchronously return the list of files
    // Note: Synchronous fetching has been deprecated and should be switched
    var url = this.resourceURL(dirname, `${dirname.toUpperCase()}.json`),
        async = callback instanceof Function,
        data;

    function alphabetically(x, y) {
        return x.name.toLowerCase() < y.name.toLowerCase() ? -1 : 1;
    }

    if (async) {
        this.getURL(
            url,
            txt => {
                var data = this.parseResourceFile(txt);
                data.sort(alphabetically);
                callback.call(this, data);
            }
        );
    } else {
        data = this.parseResourceFile(this.getURL(url));
        data.sort(alphabetically);
        return data;
    }
};

IDE_Morph.prototype.parseResourceFile = function (text) {
   /* A resource file is a JSON file with a list of objects:
    1. fileName
    2. name
    3. description
    4. categoires (optional, list)
    5. searchData (optional, list of keywords)
    6. translations (optional, map of language to name/description/searchData)

    These files are used for loading costumes, backgrounds, and sounds, and libraries.
    Translations are merged into the dictionary before rendering resourcres.
    Categories are not expected to be translated with each individual resource, instead
    translations are expected to be provided in each langauge's translation file.

    -- May 2024: categories, and searchData are not used in Snap! yet
    Categories: Used to group resources in the media/libraries viewers
    SearchData: Used to augment search results in the viewer, but not be displayed
   */
    let items = JSON.parse(text),
        language = SnapTranslator.language || 'en';

    // Update name, description, and searchData from translations
    for (let item of items) {
        if (item.translations && item.translations[language]) {
            let translation = item.translations[language];
            // ensure we never concatenate undefined arrays
            let searchData = translation.searchData || [];
            item.name = translation.name || item.name;
            item.description = translation.description || item.description;
            item.searchData = searchData + (item.searchData || []);
        }
        delete item.translations;
    }

    return items;
};

IDE_Morph.prototype.importLocalFile = function () {
    var inp = document.createElement('input'),
        addingScenes = this.isAddingScenes,
        myself = this,
        world = this.world();

    if (this.filePicker) {
        document.body.removeChild(this.filePicker);
        this.filePicker = null;
    }
    inp.type = 'file';
    inp.style.color = "transparent";
    inp.style.backgroundColor = "transparent";
    inp.style.border = "none";
    inp.style.outline = "none";
    inp.style.position = "absolute";
    inp.style.top = "0px";
    inp.style.left = "0px";
    inp.style.width = "0px";
    inp.style.height = "0px";
    inp.style.display = "none";
    inp.addEventListener(
        "change",
        () => {
            document.body.removeChild(inp);
            this.filePicker = null;
            if (addingScenes) {
                myself.isAddingNextScene = true;
            }
            myself.isImportingLocalFile = true;
            world.hand.processDrop(inp.files);
        },
        false
    );
    document.body.appendChild(inp);
    this.filePicker = inp;
    inp.click();
};

IDE_Morph.prototype.importMedia = function (folderName) {
    // open a dialog box letting the user browse available "built-in"
    // costumes, backgrounds or sounds
    var msg = this.showMessage('Opening ' + folderName + '...');
    this.getMediaList(
        folderName,
        items => {
            msg.destroy();
            this.popupMediaImportDialog(folderName, items);
        }
    );

};

IDE_Morph.prototype.popupMediaImportDialog = function (folderName, items) {
    // private - this gets called by importMedia() and creates
    // the actual dialog
    var dialog = new DialogBoxMorph().withKey('import' + folderName),
        frame = new ScrollFrameMorph(),
        selectedIcon = null,
        turtle = new SymbolMorph('turtle', 60),
        myself = this,
        world = this.world(),
        handle;

    frame.acceptsDrops = false;
    frame.contents.acceptsDrops = false;
    frame.color = myself.groupColor;
    frame.fixLayout = nop;
    dialog.labelString = folderName;
    dialog.createLabel();
    dialog.addBody(frame);
    dialog.addButton('ok', 'Import');
    dialog.addButton('cancel', 'Cancel');

    dialog.ok = function () {
        if (selectedIcon) {
            if (selectedIcon.object instanceof Sound) {
                myself.droppedAudio(
                    selectedIcon.object.copy().audio,
                    selectedIcon.labelString
                );
            } else if (selectedIcon.object instanceof SVG_Costume) {
                myself.droppedSVG(
                    selectedIcon.object.contents,
                    selectedIcon.labelString
                );
            } else {
                myself.droppedImage(
                    selectedIcon.object.contents,
                    selectedIcon.labelString
                );
            }
        }
    };

    dialog.fixLayout = function () {
        var th = fontHeight(this.titleFontSize) + this.titlePadding * 2,
            x = 0,
            y = 0,
            fp, fw;
        this.buttons.fixLayout();
        this.body.setPosition(this.position().add(new Point(
            this.padding,
            th + this.padding
        )));
        this.body.setExtent(new Point(
            this.width() - this.padding * 2,
            this.height() - this.padding * 3 - th - this.buttons.height()
        ));
        fp = this.body.position();
        fw = this.body.width();
        frame.contents.children.forEach(function (icon) {
              icon.setPosition(fp.add(new Point(x, y)));
            x += icon.width();
            if (x + icon.width() > fw) {
                x = 0;
                y += icon.height();
            }
        });
        frame.contents.adjustBounds();
        this.label.setCenter(this.center());
        this.label.setTop(this.top() + (th - this.label.height()) / 2);
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);

        // refresh shadow
        this.removeShadow();
        this.addShadow();
    };

    items.forEach(item => {
        // Caution: creating very many thumbnails can take a long time!
        var url = this.resourceURL(folderName, item.fileName),
            img = new Image(),
            suffix = url.slice(url.lastIndexOf('.') + 1).toLowerCase(),
            isSVG = suffix === 'svg' && !MorphicPreferences.rasterizeSVGs,
            isSound = contains(['wav', 'mp3'], suffix),
            icon;

        if (isSound) {
            icon = new SoundIconMorph(new Sound(new Audio(), item.name));
        } else {
            icon = new CostumeIconMorph(
                new Costume(turtle.getImage(), item.name)
            );
        }
        icon.isDraggable = false;
        icon.userMenu = nop;
        icon.action = function () {
            if (selectedIcon === icon) {return; }
            var prevSelected = selectedIcon;
            selectedIcon = icon;
            if (prevSelected) {prevSelected.refresh(); }
        };
        icon.doubleClickAction = dialog.ok;
        icon.query = function () {
            return icon === selectedIcon;
        };
        frame.addContents(icon);
        if (isSound) {
            icon.object.audio.onloadeddata = function () {
                icon.createThumbnail();
                icon.fixLayout();
                icon.refresh();
            };

            icon.object.audio.src = url;
            icon.object.audio.load();
        } else if (isSVG) {
            img.onload = function () {
                icon.object = new SVG_Costume(img, item.name);
                icon.refresh();
            };
            this.getURL(
                url,
                txt => img.src = 'data:image/svg+xml;base64,' +
                    window.btoa(txt)
            );
        } else {
            img.onload = function () {
                var canvas = newCanvas(new Point(img.width, img.height), true);
                canvas.getContext('2d').drawImage(img, 0, 0);
                icon.object = new Costume(canvas, item.name);
                icon.refresh();
            };
            img.src = url;
        }
    });
    dialog.popUp(world);
    dialog.setExtent(new Point(400, 300));
    dialog.setCenter(world.center());

    handle = new HandleMorph(
        dialog,
        300,
        280,
        dialog.corner,
        dialog.corner
    );
};

IDE_Morph.prototype.undeleteSprites = function (pos) {
    // pop up a menu showing deleted sprites that can be recovered
    // by clicking on them

    var menu = new MenuMorph(sprite => this.undelete(sprite, pos), null, this);
        pos = pos || this.corralBar.bottomRight();

    if (!this.scene.trash.length) {
        this.showMessage('trash is empty');
        return;
    }
    this.scene.trash.forEach(sprite =>
        menu.addItem(
            [
                sprite.thumbnail(new Point(24, 24), null, true), // no corpse
                sprite.name,
            ],
            sprite
        )
    );
    menu.popup(this.world(), pos);
};

IDE_Morph.prototype.undelete = function (aSprite, pos) {
    var rnd = Process.prototype.reportBasicRandom;

    aSprite.setCenter(pos);
    this.world().add(aSprite);
    aSprite.glideTo(
        this.stage.center().subtract(aSprite.extent().divideBy(2)),
        this.isAnimating ? 100 : 0,
        null, // easing
        () => {
            aSprite.isCorpse = false;
            aSprite.version = Date.now();
            aSprite.name = this.newSpriteName(aSprite.name);
            this.stage.add(aSprite);
            aSprite.setXPosition(rnd.call(this, -50, 50));
            aSprite.setYPosition(rnd.call(this, -50, 59));
            aSprite.fixLayout();
            aSprite.rerender();
            this.sprites.add(aSprite);
            this.corral.addSprite(aSprite);
            this.selectSprite(aSprite);
            this.scene.updateTrash();
        }
    );
};

// IDE_Morph menu actions

IDE_Morph.prototype.aboutSnap = function () {
    var dlg, aboutTxt, noticeTxt, creditsTxt, versions = '', translations,
        module, btn1, btn2, btn3, btn4, licenseBtn, translatorsBtn,
        world = this.world();

    aboutTxt = 'Snap! ' + SnapVersion + '\nBuild Your Own Blocks\n\n'
        + 'Copyright \u24B8 2008-2025 Jens M\u00F6nig and '
        + 'Brian Harvey\n'
        + 'jens@moenig.org, bh@cs.berkeley.edu\n\n'
        + '        Snap! is developed by the University of California, '
        + 'Berkeley and SAP        \n'
        + 'with support from the National Science Foundation (NSF),\n'
        + 'MIOsoft and YC Research.\n'
        + 'The design of Snap! is influenced and inspired by Scratch,\n'
        + 'from the Lifelong Kindergarten group at the MIT Media Lab\n\n'

        + 'for more information see https://snap.berkeley.edu';

    noticeTxt = localize('License')
        + '\n\n'
        + 'Snap! is free software: you can redistribute it and/or modify\n'
        + 'it under the terms of the GNU Affero General Public License as\n'
        + 'published by the Free Software Foundation, either version 3 of\n'
        + 'the License, or (at your option) any later version.\n\n'

        + 'This program is distributed in the hope that it will be useful,\n'
        + 'but WITHOUT ANY WARRANTY; without even the implied warranty of\n'
        + 'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n'
        + 'GNU Affero General Public License for more details.\n\n'

        + 'You should have received a copy of the\n'
        + 'GNU Affero General Public License along with this program.\n'
        + 'If not, see http://www.gnu.org/licenses/\n\n'

        + 'Want to use Snap! but scared by the open-source license?\n'
        + 'Get in touch with us, we\'ll make it work.';

    creditsTxt = localize('Contributors')
        + '\n\nNathan Dinsmore: Saving/Loading, Snap-Logo Design, '
        + '\ncountless bugfixes and optimizations'
        + '\nMichael Ball: Time/Date UI, Library Import Dialog,'
        + '\ncountless bugfixes and optimizations'
        + '\nBernat Romagosa: Countless contributions'
        + '\nBartosz Leper: Retina Display Support'
        + '\nDariusz Dorożalski: Web Serial Support,'
        + '\ncountless bugfixes and optimizations'
        + '\nZhenlei Jia and Dariusz Dorożalski: IME text editing'
        + '\nKen Kahn: IME support and countless other contributions'
        + '\nJosep Ferràndiz: Video Motion Detection'
        + '\nJoan Guillén: Countless contributions'
        + '\nKartik Chandra: Paint Editor'
        + '\nMichael Aschauer: Embroidery machine support'
        + '\nCarles Paredes: Initial Vector Paint Editor'
        + '\n"Ava" Yuan Yuan, Deborah Servilla: Graphic Effects'
        + '\nKyle Hotchkiss: Block search design'
        + '\nBrian Broll: Many bugfixes and optimizations'
        + '\nEckart Modrow: SciSnap! Extension'
        + '\nBambi Brewer: Birdbrain Robotics Extension Support'
        + '\nGlen Bull & team: TuneScope Music Extension'
        + '\nIan Reynolds: UI Design, Event Bindings, '
        + 'Sound primitives'
        + '\nJadga Hügle: Icons and countless other contributions'
        + '\nSimon Walters & Xavier Pi: MQTT extension'
        + '\nVictoria Phelps: Reporter results tracing'
        + '\nSimon Mong: Custom blocks palette arrangement'
        + '\nIvan Motyashov: Initial Squeak Porting'
        + '\nLucas Karahadian: Piano Keyboard Design'
        + '\nego-lay-atman-bay: Piano Keyboard Octave Switching'
        + '\nDavide Della Casa: Morphic Optimizations'
        + '\nAchal Dave: Web Audio'
        + '\nJoe Otto: Morphic Testing and Debugging'
        + '\n\n'
        + 'Jahrd, Derec, Jamet, Sarron, Aleassa, and Lirin costumes'
        + '\nare watercolor paintings by Meghan Taylor and represent'
        + '\n characters from her webcomic Prophecy of the Circle,'
        + '\nlicensed to us only for use in Snap! projects.'
        + '\nMeghan also painted the Tad costumes,'
        + '\nbut that character is in the public domain.';

    for (module in modules) {
        if (Object.prototype.hasOwnProperty.call(modules, module)) {
            versions += ('\n' + module + ' (' +
                            modules[module] + ')');
        }
    }
    if (versions !== '') {
        versions = localize('current module versions:') + ' \n\n' +
            'morphic (' + morphicVersion + ')' +
            versions;
    }
    translations = localize('Translations') + '\n' + SnapTranslator.credits();

    dlg = new DialogBoxMorph();

    function txt(textString) {
        var tm = new TextMorph(
                textString,
                dlg.fontSize,
                dlg.fontStyle,
                true,
                false,
                'center',
                null,
                null,
                MorphicPreferences.isFlat ? null : new Point(1, 1),
                WHITE
            ),
            scroller,
            maxHeight = world.height() - dlg.titleFontSize * 10;
        if (tm.height() > maxHeight) {
            scroller = new ScrollFrameMorph();
            scroller.acceptsDrops = false;
            scroller.contents.acceptsDrops = false;
            scroller.bounds.setWidth(tm.width());
            scroller.bounds.setHeight(maxHeight);
            scroller.addContents(tm);
            scroller.color = new Color(0, 0, 0, 0);
            return scroller;
        }
        return tm;
    }

    dlg.inform('About Snap', aboutTxt, world, this.logo.cachedTexture);
    btn1 = dlg.buttons.children[0];
    translatorsBtn = dlg.addButton(
        () => {
            dlg.addBody(txt(translations));
            dlg.body.fixLayout();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.setCenter(world.center());
        },
        'Translators...'
    );
    btn2 = dlg.addButton(
        () => {
            dlg.addBody(txt(aboutTxt));
            dlg.body.fixLayout();
            btn1.show();
            btn2.hide();
            btn3.show();
            btn4.show();
            licenseBtn.show();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.setCenter(world.center());
        },
        'Back...'
    );
    btn2.hide();
    licenseBtn = dlg.addButton(
        () => {
            dlg.addBody(txt(noticeTxt));
            dlg.body.fixLayout();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.setCenter(world.center());
        },
        'License...'
    );
    btn3 = dlg.addButton(
        () => {
            dlg.addBody(txt(versions));
            dlg.body.fixLayout();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.setCenter(world.center());
        },
        'Modules...'
    );
    btn4 = dlg.addButton(
        () => {
            dlg.addBody(txt(creditsTxt));
            dlg.body.fixLayout();
            btn1.show();
            btn2.show();
            translatorsBtn.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            dlg.fixLayout();
            dlg.setCenter(world.center());
        },
        'Credits...'
    );
    translatorsBtn.hide();
    dlg.fixLayout();
};

IDE_Morph.prototype.scenesMenu = function () {
    var menu = new MenuMorph(scn => this.switchToScene(scn), null, this),
        world = this.world(),
        pos = this.controlBar.projectButton.bottomLeft(),
        tick = new SymbolMorph(
            'tick',
            MorphicPreferences.menuFontSize * 0.75
        ),
        empty = tick.fullCopy();

    empty.render = nop;
    this.scenes.asArray().forEach(scn =>
        menu.addItem(
            [
                this.scene === scn ? tick : empty,
                scn.name
            ],
            scn
        )
    );
    menu.popup(world, pos);
};

IDE_Morph.prototype.editNotes = function () {
    var dialog = new DialogBoxMorph().withKey('notes'),
        frame = new ScrollFrameMorph(),
        text = new TextMorph(this.scenes.at(1).notes || ''),
        size = 250,
        world = this.world();

    frame.padding = 6;
    frame.setWidth(size);
    frame.acceptsDrops = false;
    frame.contents.acceptsDrops = false;

    text.setWidth(size - frame.padding * 2);
    text.setPosition(frame.topLeft().add(frame.padding));
    text.enableSelecting();
    text.isEditable = true;

    frame.setHeight(size);
    frame.fixLayout = nop;
    frame.edge = InputFieldMorph.prototype.edge;
    frame.fontSize = InputFieldMorph.prototype.fontSize;
    frame.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    frame.contrast = InputFieldMorph.prototype.contrast;
    frame.render = InputFieldMorph.prototype.render;
    frame.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    frame.addContents(text);

    dialog.getInput = () => text.text;

    dialog.target = this;

    dialog.action = (note) => {
        this.scene.notes = note;
        this.recordUnsavedChanges();
    };

    dialog.justDropped = () => text.edit();

    dialog.labelString = 'Notes';
    dialog.createLabel();
    dialog.addBody(frame);
    dialog.addButton('ok', 'OK');
    dialog.addButton('cancel', 'Cancel');
    dialog.fixLayout();
    dialog.popUp(world);
    dialog.setCenter(world.center());
    text.edit();
};

IDE_Morph.prototype.newProject = function () {
    var project = new Project();

    project.addDefaultScene();
    this.source = this.cloud.username ? 'cloud' : null;
    if (location.hash.substr(0, 6) !== '#lang:') {
        location.hash = '';
    }
    this.openProject(project);
};

IDE_Morph.prototype.createNewScene = function () {
    var setting = this.isAddingScenes;
    this.isAddingScenes = true;
    this.newProject();
    this.isAddingScenes = setting;
};

IDE_Morph.prototype.createNewCategory = function () {
    new DialogBoxMorph(
        this,
        cat => this.addPaletteCategory(cat.name, cat.color),
        this
    ).promptCategory(
        "New Category",
        null,
        new Color(0,116,143),
        this.world(),
        null, // pic
        'Blocks category name:' // msg
    );
};

IDE_Morph.prototype.addPaletteCategory = function (name, color) {
    if (name === '') {return; }
    SpriteMorph.prototype.customCategories.set(name, color);
    this.createCategories();
    this.categories.refreshEmpty();
    this.createPaletteHandle();
    this.categories.fixLayout();
    this.fixLayout();
};

IDE_Morph.prototype.deleteUserCategory = function (pos) {
    var menu = new MenuMorph(
        this.deletePaletteCategory,
        null,
        this
    );

    // sort alphabetically
    Array.from(
        SpriteMorph.prototype.customCategories.keys()
    ).sort().forEach(name =>
        menu.addItem(
            name,
            name,
            null,
            null,
            null,
            null,
            null,
            null,
            true // verbatim - don't translate
        )
    );
    if (pos) {
        menu.popup(this.world(), pos);
    } else {
        menu.popUpAtHand(this.world());
    }
};

IDE_Morph.prototype.deletePaletteCategory = function (name) {
    this.stage.globalBlocks.forEach(def =>{
        if (def.category === name) {
            def.category = 'other';
            this.currentSprite.allBlockInstances(def).reverse().forEach(
                block => block.refresh()
            );
        }
    });
    this.sprites.asArray().concat(this.stage).forEach(obj => {
        obj.customBlocks.forEach(def => {
            if (def.category === name) {
                def.category = 'other';
                obj.allDependentInvocationsOf(
                    def.blockSpec()
                ).reverse().forEach(
                    block => block.refresh(def)
                );
            }
        });
    });
    SpriteMorph.prototype.customCategories.delete(name);
    this.createCategories();
    this.createPaletteHandle();
    this.categories.fixLayout();
    this.flushPaletteCache();
    this.refreshPalette(true);
    this.categories.refreshEmpty();
    this.fixLayout();
    this.recordUnsavedChanges();
};

IDE_Morph.prototype.save = function () {
    // temporary hack - only allow exporting projects to disk
    // when running Snap! locally without a web server
    var pn = this.getProjectName();
    if (location.protocol === 'file:') {
        if (pn) {
            this.exportProject(pn);
        } else {
            this.prompt(
                'Export Project As...',
                name => this.exportProject(name),
                null,
                'exportProject'
            );
        }
        return;
    }

    if (this.source === 'examples' || this.source === 'local') {
        // cannot save to examples, deprecated localStorage
        this.source = null;
    }

    if (this.cloud.disabled) {this.source = 'disk'; }

    if (pn) {
        if (this.source === 'disk') {
            this.exportProject(pn);
        } else if (this.source === 'cloud') {
            this.saveProjectToCloud(pn);
        } else {
            this.saveProjectsBrowser();
        }
    } else {
        this.saveProjectsBrowser();
    }
};

IDE_Morph.prototype.exportProject = function (name) {
    // Export project XML, saving a file to disk
    var menu, str;
    if (name) {
        name = this.setProjectName(name);
        this.scene.captureGlobalSettings();
        try {
            menu = this.showMessage('Exporting');
            str = this.serializer.serialize(
                new Project(this.scenes, this.scene)
            );
            this.saveXMLAs(str, name);
            menu.destroy();
            this.recordSavedChanges();
            this.showMessage('Exported!', 1);
        } catch (err) {
            if (Process.prototype.isCatchingErrors) {
                this.showMessage('Export failed: ' + err);
            } else {
                throw err;
            }
        }
        this.scene.applyGlobalSettings();
    }
};

IDE_Morph.prototype.exportGlobalBlocks = function () {
    var blocks = SpriteMorph.prototype.bootstrappedBlocks().concat(
        this.stage.globalBlocks);
    if (blocks.length > 0) {
        new BlockExportDialogMorph(
            this.serializer,
            blocks,
            this
        ).popUp(this.world());
    } else {
        this.inform(
            'Export blocks',
            'this project doesn\'t have any\n'
                + 'custom global blocks yet'
        );
    }
};

IDE_Morph.prototype.exportCustomizedPrimitives = function () {
    var blocks = SpriteMorph.prototype.bootstrappedBlocks();
    if (blocks.length > 0) {
        new BlockExportDialogMorph(
            this.serializer,
            blocks,
            this
        ).popUp(this.world());
    } else {
        this.inform(
            'Export customized primitives',
            'this session doesn\'t have any\n'
                + 'customized primitives yet'
        );
    }
};

IDE_Morph.prototype.refreshCustomizedPalette = function () {
    var blocks = SpriteMorph.prototype.bootstrappedBlocks();
    if (blocks.length > 0) {
        this.serializer.loadBlocks(this.blocksLibraryXML(blocks));
    }
};

IDE_Morph.prototype.removeUnusedBlocks = function () {
    var targets = this.sprites.asArray().concat([this.stage]),
        globalBlocks = this.stage.globalBlocks,
        unused = [],
        isDone = false,
        found;

    function scan() {
        return globalBlocks.filter(def => {
            if (contains(unused, def)) {return false; }
            return targets.every((each, trgIdx) =>
                !each.usesBlockInstance(def, true, trgIdx, unused)
            );
        });
    }

    while (!isDone) {
        found = scan();
        if (found.length) {
            unused = unused.concat(found);
        } else {
            isDone = true;
        }
    }
    if (unused.length > 0) {
        new BlockRemovalDialogMorph(
            unused,
            this
        ).popUp(this.world());
    } else {
        this.inform(
            'Remove unused blocks',
            'there are currently no unused\n'
                + 'global custom blocks in this project'
        );
    }
};

IDE_Morph.prototype.generatePuzzle = function () {
    if (this.sprites.asArray().some(any => any.solution)) {
        return this.addToPuzzle();
    }

    var current = this.currentSprite,
        allBlocks = current.allPaletteBlocks(),
        used = current.scripts.allChildren().filter(
            m => m instanceof BlockMorph),
        uPrim = [],
        uCust = [],
        uVars = [],
        unused,
        puzzle;

    // add stage-only blocks
    this.stage.allPaletteBlocks().forEach(b => {
        if (!allBlocks.includes(b)) {
            allBlocks.push(b);
        }
    });

    // determine unused blocks
    used.forEach(b => {
        if (b.isCustomBlock) {
            uCust.push(b.isGlobal ? b.definition
                : current.getMethod(b.semanticSpec));
        } else if (b.selector === 'reportGetVar') {
            uVars.push(b.blockSpec);
        } else {
            uPrim.push(b.selector);
        }
    });
    unused = allBlocks.filter(b => {
        if (b.isCustomBlock) {
            return !contains(
                uCust,
                b.isGlobal ? b.definition
                    : current.getMethod(b.semanticSpec)
                );
        } else if (b.selector === 'reportGetVar') {
            return !contains(uVars, b.blockSpec);
        } else {
            return !contains(uPrim, b.selector);
        }
    });

    // hide all unused blocks and show all used ones in the palette
    allBlocks.forEach(block => current.changeBlockVisibility(
        block,
        contains(unused, block),
        true // quick - without palette update
    ));
    if (unused.length === 0) {
        StageMorph.prototype.hiddenPrimitives = [];
    }

    // fire user edit event
    current.recordUserEdit(
        'palette',
        'hide block'
    );

    // turn on single palette and hide buttons
    this.setUnifiedPalette(true);
    this.scene.showPaletteButtons = false;

    // refresh
    this.flushBlocksCache();
    this.refreshPalette();
    this.categories.refreshEmpty();

    // generate a new puzzle sprite by duplicating the current one
    this.duplicateSprite(current);
    puzzle = this.currentSprite; // this is now the duplicate
    puzzle.setPosition(current.position());
    puzzle.setName(this.newSpriteName(current.name + ' ' + localize('Puzzle')));

    // remove all scripts but keep the comments that are either unattached
    // or attached to the top block of a script
    puzzle.scripts.children.forEach(m => {
        if (m instanceof CommentMorph) {
            m.prepareToBeGrabbed();
        }
    });
    puzzle.scripts.children.filter(m =>
        m instanceof BlockMorph
    ).forEach(b => b.destroy());

    // store the solution inside the puzzlem
    // and remove the solution from the stage
    puzzle.solution = current;
    this.removeSprite(current, false); // disable undelete

    // refresh
    this.selectSprite(puzzle);
};

IDE_Morph.prototype.addToPuzzle = function () {
    var current = this.currentSprite,
        allBlocks = current.allPaletteBlocks(),
        used = current.scripts.allChildren().filter(
            m => m instanceof BlockMorph),
        uCust = [],
        unused,
        puzzle;

    // add stage-only blocks
    this.stage.allPaletteBlocks().forEach(b => {
        if (!allBlocks.includes(b)) {
            allBlocks.push(b);
        }
    });

    // determine unused local blocks only
    used.forEach(b => {
        if (b.isCustomBlock && !b.isGlobal) {
            uCust.push(current.getMethod(b.semanticSpec));
        }
    });
    unused = allBlocks.filter(b => b.isCustomBlock && !b.isGlobal &&
        !contains(uCust, current.getMethod(b.semanticSpec))
    );

    // hide unused local custom bocks
    unused.forEach(block => current.changeBlockVisibility(block, true, true));

    // show used blocks
    used.forEach(block => current.changeBlockVisibility(block, false, true));

    // fire user edit event
    current.recordUserEdit(
        'palette',
        'hide block'
    );

    // refresh
    this.flushBlocksCache();
    this.refreshPalette();
    this.categories.refreshEmpty();

    // generate a new puzzle sprite by duplicating the current one
    this.duplicateSprite(current);
    puzzle = this.currentSprite; // this is now the duplicate
    puzzle.setPosition(current.position());
    puzzle.setName(this.newSpriteName(current.name + ' ' + localize('Puzzle')));

    // remove all scripts but keep the comments that are either unattached
    // or attached to the top block of a script
    puzzle.scripts.children.forEach(m => {
        if (m instanceof CommentMorph) {
            m.prepareToBeGrabbed();
        }
    });
    puzzle.scripts.children.filter(m =>
        m instanceof BlockMorph
    ).forEach(b => b.destroy());

    // store the solution inside the puzzlem
    // and remove the solution from the stage
    puzzle.solution = current;
    this.removeSprite(current, false); // disable undelete

    // refresh
    this.selectSprite(puzzle);
};
IDE_Morph.prototype.exportSprite = function (sprite) {
    this.saveXMLAs(sprite.toXMLString(), sprite.name);
};

IDE_Morph.prototype.exportScriptsPicture = function () {
    var pics = [],
        pic,
        padding = 20,
        w = 0,
        h = 0,
        y = 0,
        ctx;

    // collect all script pics
    this.sprites.asArray().forEach(sprite => {
        pics.push(sprite.getImage());
        pics.push(sprite.scripts.scriptsPicture());
        sprite.customBlocks.forEach(def =>
            pics.push(def.scriptsPicture())
        );
    });
    pics.push(this.stage.getImage());
    pics.push(this.stage.scripts.scriptsPicture());
    this.stage.customBlocks.forEach(def =>
        pics.push(def.scriptsPicture())
    );

    // collect global block pics
    this.stage.globalBlocks.forEach(def =>
        pics.push(def.scriptsPicture())
    );

    pics = pics.filter(each => !isNil(each));

    // determine dimensions of composite
    pics.forEach(each => {
        w = Math.max(w, each.width);
        h += (each.height);
        h += padding;
    });
    h -= padding;
    pic = newCanvas(new Point(w, h));
    ctx = pic.getContext('2d');

    // draw all parts
    pics.forEach(each => {
        ctx.drawImage(each, 0, y);
        y += padding;
        y += each.height;
    });
    this.saveCanvasAs(pic, this.scene.name || localize('Untitled'));
};

IDE_Morph.prototype.exportProjectSummary = function (useDropShadows) {
    var html, head, meta, css, body, pname, notes, toc, globalVars,
        stage = this.stage;

    function addNode(tag, node, contents) {
        if (!node) {node = body; }
        return new XML_Element(tag, contents, node);
    }

    function add(contents, tag, node) {
        if (!tag) {tag = 'p'; }
        if (!node) {node = body; }
        return new XML_Element(tag, contents, node);
    }

    function addImage(canvas, node, inline) {
        if (!node) {node = body; }
        var para = !inline ? addNode('p', node) : null,
            pic = addNode('img', para || node);
        pic.attributes.src = canvas.toDataURL();
        return pic;
    }

    function addVariables(varFrame) {
        var names = varFrame.names().sort(),
            isFirst = true,
            ul;
        if (names.length) {
            add(localize('Variables'), 'h3');
            names.forEach(name => {
                /*
                addImage(
                    SpriteMorph.prototype.variableBlock(name).scriptPic()
                );
                */
                var watcher, listMorph, li, img;

                if (isFirst) {
                    ul = addNode('ul');
                    isFirst = false;
                }
                li = addNode('li', ul);
                watcher = new WatcherMorph(
                    name,
                    SpriteMorph.prototype.blockColor.variables,
                    varFrame,
                    name
                );
                listMorph = watcher.cellMorph.contentsMorph;
                if (listMorph instanceof ListWatcherMorph) {
                    listMorph.expand();
                }
                img = addImage(watcher.fullImage(), li);
                img.attributes.class = 'script';
            });
        }
    }

    function addBlocks(definitions) {
        if (definitions.length) {
            add(localize('Blocks'), 'h3');
            SpriteMorph.prototype.allCategories().forEach(category => {
                var isFirst = true,
                    ul;
                definitions.forEach(def => {
                    var li, blockImg;
                    if (def.category === category) {
                        if (isFirst) {
                            add(
                                localize(
                                    category[0].toUpperCase().concat(
                                        category.slice(1)
                                    )
                                ),
                                'h4'
                            );
                            ul = addNode('ul');
                            isFirst = false;
                        }
                        li = addNode('li', ul);
                        blockImg = addImage(
                            def.templateInstance().scriptPic(),
                            li
                        );
                        blockImg.attributes.class = 'script';
                        def.sortedElements().forEach(script => {
                            var defImg = addImage(
                                script instanceof BlockMorph ?
                                        script.scriptPic()
                                                : script.fullImage(),
                                li
                            );
                            defImg.attributes.class = 'script';
                        });
                    }
                });
            });
        }
    }

    pname = this.scene.name || localize('untitled');

    html = new XML_Element('html');
    html.attributes.lang = SnapTranslator.language;
    // html.attributes.contenteditable = 'true';

    head = addNode('head', html);

    meta = addNode('meta', head);
    meta.attributes.charset = 'UTF-8';

    if (useDropShadows) {
        css = 'img {' +
            'vertical-align: top;' +
            'filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));' +
            '-webkit-filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));' +
            '-ms-filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));' +
            '}' +
            '.toc {' +
            'vertical-align: middle;' +
            'padding: 2px 1em 2px 1em;' +
            '}';
    } else {
        css = 'img {' +
            'vertical-align: top;' +
            '}' +
            '.toc {' +
            'vertical-align: middle;' +
            'padding: 2px 1em 2px 1em;' +
            '}' +
            '.sprite {' +
            'border: 1px solid lightgray;' +
            '}';
    }
    addNode('style', head, css);

    add(pname, 'title', head);

    body = addNode('body', html);
    add(pname, 'h1');

    /*
    if (this.cloud.username) {
        add(localize('by ') + this.cloud.username);
    }
    */
    if (location.hash.indexOf('#present:') === 0) {
        add(location.toString(), 'a', body).attributes.href =
            location.toString();
        addImage(
            stage.thumbnail(stage.dimensions)
        ).attributes.class = 'sprite';
        add(this.serializer.app, 'h4');
    } else {
        add(this.serializer.app, 'h4');
        addImage(
            stage.thumbnail(stage.dimensions)
        ).attributes.class = 'sprite';
    }

    // project notes
    notes = Process.prototype.reportTextSplit(this.scene.notes, 'line');
    notes.asArray().forEach(paragraph => add(paragraph));

    // table of contents
    add(localize('Contents'), 'h4');
    toc = addNode('ul');

    // sprites & stage
    this.sprites.asArray().concat([stage]).forEach(sprite => {
        var tocEntry = addNode('li', toc),
            scripts = sprite.scripts.sortedElements(),
            cl = sprite.costumes.length(),
            pic,
            ol;

        addNode('hr');
        addImage(
            sprite.thumbnail(new Point(40, 40)),
            tocEntry,
            true
        ).attributes.class = 'toc';
        add(sprite.name, 'a', tocEntry).attributes.href = '#' + sprite.name;

        add(sprite.name, 'h2').attributes.id = sprite.name;
        // if (sprite instanceof SpriteMorph || sprite.costume) {
        pic = addImage(
            sprite.thumbnail(sprite.extent().divideBy(stage.scale))
        );
        pic.attributes.class = 'sprite';
        if (sprite instanceof SpriteMorph) {
            if (sprite.exemplar) {
                addImage(
                    sprite.exemplar.thumbnail(new Point(40, 40)),
                    add(localize('Kind of') + ' ' + sprite.exemplar.name),
                    true
                ).attributes.class = 'toc';
            }
            if (sprite.anchor) {
                addImage(
                    sprite.anchor.thumbnail(new Point(40, 40)),
                    add(localize('Part of') + ' ' + sprite.anchor.name),
                    true
                ).attributes.class = 'toc';
            }
            if (sprite.parts.length) {
                add(localize('Parts'), 'h3');
                ol = addNode('ul');
                sprite.parts.forEach(part => {
                    var li = addNode('li', ol, part.name);
                    addImage(part.thumbnail(new Point(40, 40)), li, true)
                        .attributes.class = 'toc';
                });
            }
        }

        // costumes
        if (cl > 1 || (sprite.getCostumeIdx() !== cl)) {
            add(localize('Costumes'), 'h3');
            ol = addNode('ol');
            sprite.costumes.asArray().forEach(costume => {
                var li = addNode('li', ol, costume.name);
                addImage(costume.thumbnail(new Point(40, 40)), li, true)
                    .attributes.class = 'toc';
            });
        }

        // sounds
        if (sprite.sounds.length()) {
            add(localize('Sounds'), 'h3');
            ol = addNode('ol');
            sprite.sounds.asArray().forEach(sound =>
                add(sound.name, 'li', ol)
            );
        }

        // variables
        addVariables(sprite.variables);

        // scripts
        if (scripts.length) {
            add(localize('Scripts'), 'h3');
            scripts.forEach(script => {
                var img = addImage(script instanceof BlockMorph ?
                        script.scriptPic()
                                : script.fullImage());
                img.attributes.class = 'script';
            });
        }

        // custom blocks
        addBlocks(sprite.customBlocks);
    });

    // globals
    globalVars = stage.globalVariables();
    if (Object.keys(globalVars.vars).length || stage.globalBlocks.length) {
        addNode('hr');
        add(
            localize('For all Sprites'),
            'a',
            addNode('li', toc)
        ).attributes.href = '#global';
        add(localize('For all Sprites'), 'h2').attributes.id = 'global';

        // variables
        addVariables(globalVars);

        // custom blocks
        addBlocks(stage.globalBlocks);
    }

    this.saveFileAs(
        '<!DOCTYPE html>' + html.toString(),
        'text/html;charset=utf-8',
        pname
    );
};

IDE_Morph.prototype.openProjectString = function (str, callback, noPrims) {
    var msg;
    if (this.bulkDropInProgress || this.isAddingScenes) {
        this.rawOpenProjectString(str, noPrims);
        if (callback) {callback(); }
        return;
    }
    // reset prims
    SpriteMorph.prototype.initBlocks();

    this.nextSteps([
        () => msg = this.showMessage('Opening project...'),
        () => {
            this.rawOpenProjectString(str, noPrims);
            msg.destroy();
            if (callback) {callback(); }
        }
    ]);
};

IDE_Morph.prototype.rawOpenProjectString = function (str, noPrims) {
    this.toggleAppMode(false);
    this.spriteBar.tabBar.tabTo('scripts');
    if (Process.prototype.isCatchingErrors) {
        try {
            this.openProject(
                this.serializer.load(str, this, noPrims)
            );
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        this.openProject(
            this.serializer.load(str, this, noPrims)
        );
    }
    this.autoLoadExtensions();
    this.stopFastTracking();
};

IDE_Morph.prototype.openCloudDataString = function (str) {
    var msg,
        size = Math.round(str.length / 1024);
    this.nextSteps([
        () => msg = this.showMessage('Opening project\n' + size + ' KB...'),
        () => {
            this.rawOpenCloudDataString(str);
            msg.destroy();
        }
    ]);
};

IDE_Morph.prototype.rawOpenCloudDataString = function (str) {
    var model,
        setting = this.isAddingScenes;

    if (this.isAddingNextScene) {
        this.isAddingScenes = true;
    }
    if (Process.prototype.isCatchingErrors) {
        try {
            model = this.serializer.parse(str);
            this.serializer.loadMediaModel(model.childNamed('media'));
            this.openProject(
                this.serializer.loadProjectModel(
                    model.childNamed('project'),
                    this,
                    model.attributes.remixID
                )
            );
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        model = this.serializer.parse(str);
        this.serializer.loadMediaModel(model.childNamed('media'));
        this.openProject(
            this.serializer.loadProjectModel(
                model.childNamed('project'),
                this,
                model.attributes.remixID
            )
        );
    }
    this.autoLoadExtensions();
    this.stopFastTracking();
    this.isAddingScenes = setting;
    this.isAddingNextScene = false;
};

IDE_Morph.prototype.openBlocksString = function (str, name, silently) {
    var msg;
    this.nextSteps([
        () => msg = this.showMessage('Opening blocks...'),
        () => {
            this.rawOpenBlocksString(str, name, silently);
            msg.destroy();
        }
    ]);
};

IDE_Morph.prototype.rawOpenBlocksString = function (str, name, silently) {
    // name is optional (string), so is silently (bool)
    var blocks;
    this.toggleAppMode(false);
    this.spriteBar.tabBar.tabTo('scripts');
    if (Process.prototype.isCatchingErrors) {
        try {
            blocks = this.serializer.loadBlocks(str, this.stage);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        blocks = this.serializer.loadBlocks(str, this.stage);
    }
    if (silently) {
        blocks.global.forEach(def => {
            def.receiver = this.stage;
            this.stage.globalBlocks.push(def);
            this.stage.replaceDoubleDefinitionsFor(def);
        });
        blocks.local.forEach(def => {
            def.receiver = this.currentSprite;
            this.currentSprite.customBlocks.push(def);
            this.currentSprite.replaceDoubleDefinitionsFor(def);
        });
        if (blocks.data) {
            this.globalVariables.merge(blocks.data);
            this.flushBlocksCache('variables');
        }
        if (blocks.localData) {
            this.currentSprite.variables.merge(blocks.localData);
            this.flushBlocksCache('variables');
        }
        this.flushPaletteCache();
        this.refreshPalette();
        this.showMessage(
            'Imported Blocks Module' + (name ? ': ' + name : '') + '.',
            2
        );
    } else {
        new BlockImportDialogMorph(
            blocks.global.concat(blocks.local),
            this.stage,
            name
        ).popUp();
    }
    this.createCategories();
    this.categories.refreshEmpty();
    this.createPaletteHandle();
    this.categories.fixLayout();
    this.fixLayout();
    this.autoLoadExtensions();
};

IDE_Morph.prototype.openSpritesString = function (str) {
    var msg;
    this.nextSteps([
        () => msg = this.showMessage('Opening sprite...'),
        () => {
            this.rawOpenSpritesString(str);
            msg.destroy();
        },
    ]);
};

IDE_Morph.prototype.rawOpenSpritesString = function (str) {
    this.toggleAppMode(false);
    this.spriteBar.tabBar.tabTo('scripts');
    if (Process.prototype.isCatchingErrors) {
        try {
            this.deserializeSpritesString(str);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        this.deserializeSpritesString(str);
    }
    this.autoLoadExtensions();
};

IDE_Morph.prototype.deserializeSpritesString = function (str) {
    var xml = this.serializer.parse(str, true), // assert version
        blocksModel = xml.childNamed('blocks'),
        blocks;

    if (blocksModel) {
        // load the custom block definitions the sprites depend on
        blocks = this.serializer.loadBlocksModel(blocksModel, this.stage);
        blocks.global.forEach(def => {
            def.receiver = this.stage;
            this.stage.globalBlocks.push(def);
            this.stage.replaceDoubleDefinitionsFor(def);
        });
        // load global variables which the custom blocks rely on
        if (blocks.data) {
            this.globalVariables.merge(blocks.data);
            this.flushBlocksCache('variables');
        }
        // notice, there should not be any local blocks or datain this part of
        // the model instead we're expecting them inside each sprite
        this.flushPaletteCache();
        this.refreshPalette();
        this.createCategories();
        this.categories.refreshEmpty();
        this.createPaletteHandle();
        this.categories.fixLayout();
        this.fixLayout();
    }
    this.serializer.loadSpritesModel(xml, this);
};

IDE_Morph.prototype.openMediaString = function (str) {
    if (Process.prototype.isCatchingErrors) {
        try {
            this.serializer.loadMedia(str);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        this.serializer.loadMedia(str);
    }
    this.showMessage('Imported Media Module.', 2);
};

IDE_Morph.prototype.openScriptString = function (str) {
    var msg;
    this.nextSteps([
        () => msg = this.showMessage('Opening script...'),
        () => {
            this.rawOpenScriptString(str);
            msg.destroy();
        }
    ]);
};

IDE_Morph.prototype.rawOpenScriptString = function (str, silently) {
    var world = this.world(),
        script;

    if (Process.prototype.isCatchingErrors) {
        try {
            script = this.deserializeScriptString(str);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        script = this.deserializeScriptString(str);
    }
    script.fixBlockColor(null, true);
    this.spriteBar.tabBar.tabTo('scripts');
    if (silently) {
        this.currentSprite.scripts.add(script);
        this.currentSprite.scripts.cleanUp();
    } else {
        script.pickUp(world);
        world.hand.grabOrigin = {
            origin: this.palette,
            position: this.palette.center()
        };
    }
    this.showMessage(
        'Imported Script.',
        2
    );
    this.autoLoadExtensions();
};

IDE_Morph.prototype.deserializeScriptString = function (str) {
    var xml = this.serializer.parse(str, true), // assert version
        blocksModel = xml.childNamed('blocks'),
        scriptModel = xml.childNamed('script') || xml,
        blocks;

    if (blocksModel) {
        // load the custom block definitions the script depends on
        blocks = this.serializer.loadBlocksModel(blocksModel, this.stage);
        blocks.global.forEach(def => {
            def.receiver = this.stage;
            this.stage.globalBlocks.push(def);
            this.stage.replaceDoubleDefinitionsFor(def);
        });
        blocks.local.forEach(def => {
            def.receiver = this.currentSprite;
            this.currentSprite.customBlocks.push(def);
            this.currentSprite.replaceDoubleDefinitionsFor(def);
        });
        if (blocks.data) {
            this.globalVariables.merge(blocks.data);
            this.flushBlocksCache('variables');
        }
        if (blocks.localData) {
            this.currentSprite.variables.merge(blocks.localData);
            this.flushBlocksCache('variables');
        }
        this.flushPaletteCache();
        this.refreshPalette();
        this.createCategories();
        this.categories.refreshEmpty();
        this.createPaletteHandle();
        this.categories.fixLayout();
        this.fixLayout();
    }
    return this.serializer.loadScriptModel(scriptModel, this.currentSprite);
};

IDE_Morph.prototype.openScriptsOnlyString = function (str) {
    // open scripts that do not contain dependencies such as variable
    // declarations and custom block definitions (!)
    var msg;
    this.nextSteps([
        () => msg = this.showMessage('Opening scripts...'),
        () => {
            this.rawOpenScriptsOnlyString(str);
            msg.destroy();
        }
    ]);
};

IDE_Morph.prototype.rawOpenScriptsOnlyString = function (str) {
    // import scripts that do not contain dependencies such as variable
    // declarations and custom block definitions (!)
    var object = this.currentSprite,
        scripts = object.scripts,
        xml;

    if (Process.prototype.isCatchingErrors) {
        try {
            xml = this.serializer.parse(str, true);
            this.serializer.loadScripts(object, scripts, xml);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        xml = this.serializer.parse(str, true);
        this.serializer.loadScripts(object, scripts, xml);
    }
    scripts.changed();
    this.spriteBar.tabBar.tabTo('scripts');
    this.showMessage(
        'Imported Scripts.',
        2
    );
};

IDE_Morph.prototype.openDataString = function (str, name, type) {
    var msg;
    this.nextSteps([
        () => msg = this.showMessage('Opening data...'),
        () => {
            this.rawOpenDataString(str, name, type);
            msg.destroy();
        }
    ]);
};

IDE_Morph.prototype.rawOpenDataString = function (str, name, type) {
    var data, vName, dlg,
        globals = this.currentSprite.globalVariables();

    function newVarName(name) {
        var existing = globals.names(),
            ix = name.indexOf('\('),
            stem = ((ix < 0) ? name : name.substring(0, ix)).trim(),
            count = 1,
            newName = stem;
        while (contains(existing, newName)) {
            count += 1;
            newName = stem + ' (' + count + ')';
        }
        return newName;
    }

    switch (type) {
        case 'csv':
            data = Process.prototype.parseCSV(str);
            break;
        case 'json':
            data = Process.prototype.parseJSON(str);
            break;
        default: // assume plain text
            data = str;
    }
    vName = newVarName(name || 'data');
    globals.addVar(vName);
    globals.setVar(vName, data);
    this.currentSprite.toggleVariableWatcher(vName, true); // global
    this.flushBlocksCache('variables');
    this.currentCategory = this.scene.unifiedPalette ? 'unified' : 'variables';
    this.categories.refresh();
    this.refreshPalette(true);
    if (data instanceof List) {
        dlg = new TableDialogMorph(data);
        dlg.labelString = localize(dlg.labelString) + ': ' + vName;
        dlg.createLabel();
        dlg.popUp(this.world());
    }
    this.autoLoadExtensions();
};

IDE_Morph.prototype.openProjectName = function (name) {
    var str;
    if (name) {
        this.showMessage('opening project\n' + name);
        this.setProjectName(name);
        str = localStorage['-snap-project-' + name];
        this.openProjectString(str);
    }
};

IDE_Morph.prototype.openProject = function (project, purgeCustomizedPrims) {
    var scn = project.currentScene || project.scenes.at(1);
    if (this.isAddingScenes) {
        project.scenes.itemsArray().forEach(scene => {
            scene.name = this.newSceneName(scene.name, scene);
            this.scenes.add(scene);
        });
    } else {
        this.scenes = project.scenes;
    }
    this.performerMode = false;
    if (purgeCustomizedPrims) {
        scn.blocks = SpriteMorph.prototype.primitiveBlocks();
    }
    this.switchToScene(
        scn,
        true,  // refresh album
        null, // msg
        null, // data
        true // pause generic WHEN hat blocks
    );
};

IDE_Morph.prototype.autoLoadExtensions = function () {
    // experimental - allow auto-loading extensions from urls specified
    // in global variables whose names start with "__module__".
    // Still very much under construction, also needs to be tweaked for
    // asynch operation
    var urls = [];
    Object.keys(this.globalVariables.vars).forEach(vName => {
        var val;
        if (vName.startsWith('__module__')) {
            val = this.globalVariables.getVar(vName);
            if (isString(val)) {
                urls.push(val);
            }
        }
    });
    urls.forEach(url => {
        var scriptElement;
        if (contains(SnapExtensions.scripts, url)) {
            return;
        }
        if (Process.prototype.enableJS || SnapExtensions.urls.some(
            any => url.indexOf(any) === 0)
        ) {
            scriptElement = document.createElement('script');
            scriptElement.onload = () => {
                SnapExtensions.scripts.push(url);
            };
            document.head.appendChild(scriptElement);
            scriptElement.src = url;
        /*
        } else {
            // throw new Error(
                'unlisted extension url:\n"' + url + '"\n' +
                'JavaScript extensions for Snap!\nare turned off'
            );
        */
        }
    });
};

IDE_Morph.prototype.switchToScene = function (
    scene,
    refreshAlbum,
    msg,
    data,
    pauseHats
) {
    var appMode = this.isAppMode,
        listeners;
    if (!scene || !scene.stage) {
        return;
    }
    this.siblings().filter(
        morph => !morph.nag
    ).forEach(
        morph => morph.destroy()
    );
    this.scene.captureGlobalSettings();
    this.scene = scene;
    this.globalVariables = scene.globalVariables;
    listeners = this.stage.messageCallbacks;
    this.stage.destroy();
    this.add(scene.stage);
    this.stage = scene.stage;
    this.stage.messageCallbacks = listeners;
    this.sprites = scene.sprites;
    if (pauseHats) {
        this.stage.pauseGenericHatBlocks();
    }
    this.createCorral(!refreshAlbum); // keep scenes
    scene.applyGlobalSettings();
    this.selectSprite(this.scene.currentSprite, true);
    this.corral.album.updateSelection();
    this.fixLayout();
    this.corral.album.contents.children.forEach(function (morph) {
        if (morph.state) {
            morph.scrollIntoView();
        }
    });
    if (!SpriteMorph.prototype.allCategories().includes(this.currentCategory)) {
        this.currentCategory = 'motion';
    }
    if (!this.setUnifiedPalette(scene.unifiedPalette)) {
        this.createCategories();
        this.createPaletteHandle();
        this.categories.fixLayout();
        this.fixLayout();
        this.flushBlocksCache();
        this.categories.refreshEmpty();
        this.currentSprite.palette(this.currentCategory);
        this.refreshPalette(true);
    }
    this.toggleAppMode(appMode);
    this.controlBar.stopButton.refresh();
    this.world().keyboardFocus = this.stage;
    if (msg) {
        this.stage.fireChangeOfSceneEvent(msg, data);
    }
};

IDE_Morph.prototype.saveFileAs = function (
    contents,
    fileType,
    fileName
) {
    /** Allow for downloading a file to a disk.
        This relies the FileSaver.js library which exports saveAs()
        Two utility methods saveImageAs and saveXMLAs should be used first.
    */
    var blobIsSupported = false,
        world = this.world(),
        fileExt,
        dialog;

    // fileType is a <kind>/<ext>;<charset> format.
    fileExt = fileType.split('/')[1].split(';')[0];
    // handle text/plain as a .txt file
    fileExt = '.' + (fileExt === 'plain' ? 'txt' : fileExt);

    function dataURItoBlob(text, mimeType) {
        var i,
            data = text,
            components = text.split(','),
            hasTypeStr = text.indexOf('data:') === 0;
        // Convert to binary data, in format Blob() can use.
        if (hasTypeStr && components[0].indexOf('base64') > -1) {
            text = atob(components[1]);
            data = new Uint8Array(text.length);
            i = text.length;
            while (i--) {
                data[i] = text.charCodeAt(i);
            }
        } else if (hasTypeStr) {
            // not base64 encoded
            text = text.replace(/^data:image\/.*?, */, '');
            data = new Uint8Array(text.length);
            i = text.length;
            while (i--) {
                data[i] = text.charCodeAt(i);
            }
        }
        return new Blob([data], {type: mimeType });
    }

    try {
        blobIsSupported = !!new Blob();
    } catch (e) {}

    if (blobIsSupported) {
        if (!(contents instanceof Blob)) {
            contents = dataURItoBlob(contents, fileType);
        }
        // download a file and delegate to FileSaver
        // false: Do not preprend a BOM to the file.
        saveAs(contents, fileName + fileExt, false);
    } else {
        dialog = new DialogBoxMorph();
        dialog.inform(
            localize('Could not export') + ' ' + fileName,
            'unable to export text',
            world
        );
        dialog.fixLayout();
    }
};

IDE_Morph.prototype.saveCanvasAs = function (canvas, fileName) {
    // Export a Canvas object as a PNG image
    // Note: This commented out due to poor browser support.
    // cavas.toBlob() is currently supported in Firefox, IE, Chrome but
    // browsers prevent easily saving the generated files.
    // Do not re-enable without revisiting issue #1191
    // if (canvas.toBlob) {
    //     var myself = this;
    //     canvas.toBlob(function (blob) {
    //         myself.saveFileAs(blob, 'image/png', fileName);
    //     });
    //     return;
    // }

    this.saveFileAs(canvas.toDataURL(), 'image/png', fileName);
};

IDE_Morph.prototype.saveAudioAs = function (audio, fileName) {
    // Export a Sound object as a WAV file
    this.saveFileAs(audio.src, 'audio/wav', fileName);
};

IDE_Morph.prototype.saveXMLAs = function(xml, fileName) {
    // wrapper to saving XML files with a proper type tag.
    this.saveFileAs(xml, 'text/xml;chartset=utf-8', fileName);
};

IDE_Morph.prototype.switchToUserMode = function () {
    var world = this.world();

    world.isDevMode = false;
    Process.prototype.isCatchingErrors = true;
    this.controlBar.updateLabel();
    this.isAutoFill = true;
    this.isDraggable = false;
    this.reactToWorldResize(world.bounds.copy());
    this.siblings().forEach(morph => {
        if (morph instanceof DialogBoxMorph) {
            world.add(morph); // bring to front
        } else {
            morph.destroy();
        }
    });
    this.flushBlocksCache();
    this.refreshPalette();
    this.categories.refreshEmpty();
    // prevent non-DialogBoxMorphs from being dropped
    // onto the World in user-mode
    world.reactToDropOf = (morph) => {
        if (!(morph instanceof DialogBoxMorph ||
        		(morph instanceof MenuMorph))) {
            if (world.hand.grabOrigin) {
                morph.slideBackTo(world.hand.grabOrigin);
            } else {
                world.hand.grab(morph);
            }
        }
    };
    this.showMessage('entering user mode', 1);
};

IDE_Morph.prototype.switchToDevMode = function () {
    var world = this.world();

    world.isDevMode = true;
    Process.prototype.isCatchingErrors = false;
    this.controlBar.updateLabel();
    this.isAutoFill = false;
    this.isDraggable = true;
    this.setExtent(world.extent().subtract(100));
    this.setPosition(world.position().add(20));
    this.flushBlocksCache();
    this.refreshPalette();
    this.categories.refreshEmpty();
    // enable non-DialogBoxMorphs to be dropped
    // onto the World in dev-mode
    delete world.reactToDropOf;
    this.showMessage(
        'entering development mode.\n\n'
            + 'error catching is turned off,\n'
            + 'use the browser\'s web console\n'
            + 'to see error messages.'
    );
};

IDE_Morph.prototype.flushBlocksCache = function (category) {
    // if no category is specified, the whole cache gets flushed
    if (category && category !== 'unified') {
        this.stage.primitivesCache[category] = null;
        this.stage.children.forEach(m => {
            if (m instanceof SpriteMorph) {
                m.primitivesCache[category] = null;
            }
        });
    } else {
        this.stage.primitivesCache = {};
        this.stage.children.forEach(m => {
            if (m instanceof SpriteMorph) {
                m.primitivesCache = {};
            }
        });
    }
    this.flushPaletteCache(category);
};

IDE_Morph.prototype.flushPaletteCache = function (category) {
    // if no category is specified, the whole cache gets flushed
    if (category) {
        this.stage.paletteCache[category] = null;
        this.stage.paletteCache.unified = null;
        this.stage.children.forEach(m => {
            if (m instanceof SpriteMorph) {
                m.paletteCache[category] = null;
                m.paletteCache.unified = null;
            }
        });
    } else {
        this.stage.paletteCache = {};
        this.stage.children.forEach(m => {
            if (m instanceof SpriteMorph) {
                m.paletteCache = {};
            }
        });
    }
    this.stage.categoriesCache = null;
    this.stage.children.forEach(m => {
        if (m instanceof SpriteMorph) {
            m.categoriesCache = null;
        }
    });
};

IDE_Morph.prototype.toggleZebraColoring = function () {
    var scripts = [];

    if (!BlockMorph.prototype.zebraContrast) {
        BlockMorph.prototype.zebraContrast = 40;
    } else {
        BlockMorph.prototype.zebraContrast = 0;
    }

    // select all scripts:
    this.stage.children.concat(this.stage).forEach(morph => {
        if (isSnapObject(morph)) {
            scripts = scripts.concat(
                morph.scripts.children.filter(morph =>
                    morph instanceof BlockMorph
                )
            );
        }
    });

    // force-update all scripts:
    scripts.forEach(topBlock =>
        topBlock.fixBlockColor(null, true)
    );
};

IDE_Morph.prototype.toggleDynamicInputLabels = function () {
    SyntaxElementMorph.prototype.dynamicInputLabels =
        !SyntaxElementMorph.prototype.dynamicInputLabels;
    this.refreshIDE();
};

IDE_Morph.prototype.toggleBlurredShadows = function () {
    window.useBlurredShadows = !useBlurredShadows;
    this.rerender();
    if (window.useBlurredShadows) {
        this.removeSetting('solidshadow');
    } else {
        this.saveSetting('solidshadow', false);
    }
};

IDE_Morph.prototype.toggleLongFormInputDialog = function () {
    InputSlotDialogMorph.prototype.isLaunchingExpanded =
        !InputSlotDialogMorph.prototype.isLaunchingExpanded;
    if (InputSlotDialogMorph.prototype.isLaunchingExpanded) {
        this.saveSetting('longform', true);
    } else {
        this.removeSetting('longform');
    }
};

IDE_Morph.prototype.togglePlainPrototypeLabels = function () {
    BlockLabelPlaceHolderMorph.prototype.plainLabel =
        !BlockLabelPlaceHolderMorph.prototype.plainLabel;
    if (BlockLabelPlaceHolderMorph.prototype.plainLabel) {
        this.saveSetting('plainprototype', true);
    } else {
        this.removeSetting('plainprototype');
    }
};

IDE_Morph.prototype.togglePreferEmptySlotDrops = function () {
    ScriptsMorph.prototype.isPreferringEmptySlots =
        !ScriptsMorph.prototype.isPreferringEmptySlots;
};

IDE_Morph.prototype.toggleInputSliders = function () {
    MorphicPreferences.useSliderForInput =
        !MorphicPreferences.useSliderForInput;
};

IDE_Morph.prototype.toggleSliderExecute = function () {
    ArgMorph.prototype.executeOnSliderEdit =
        !ArgMorph.prototype.executeOnSliderEdit;
};

IDE_Morph.prototype.togglePerformerMode = function () {
    this.performerMode = !this.performerMode;
    if (!this.performerMode) {
        this.setStageExtent(new Point(480, 360));
    }
    this.buildPanes();
    this.fixLayout();
    this.selectSprite(this.currentSprite);
};

IDE_Morph.prototype.setEmbedMode = function () {
    var myself = this;

    this.isEmbedMode = true;
    this.appModeColor = new Color(243,238,235);
    this.embedOverlay = new Morph();
    this.embedOverlay.color = new Color(128, 128, 128);
    this.embedOverlay.alpha = 0.5;

    this.embedPlayButton = new SymbolMorph('circleSolid');
    this.embedPlayButton.color = new Color(64, 128, 64);
    this.embedPlayButton.alpha = 0.75;
    this.embedPlayButton.flag = new SymbolMorph('flag');
    this.embedPlayButton.flag.color = new Color(128, 255, 128);
    this.embedPlayButton.flag.alpha = 0.75;
    this.embedPlayButton.add(this.embedPlayButton.flag);
    this.embedPlayButton.mouseClickLeft = function () {
        myself.runScripts();
        myself.embedOverlay.destroy();
        this.destroy();
    };

    this.controlBar.hide();

    this.add(this.embedOverlay);
    this.add(this.embedPlayButton);

    this.fixLayout();
};

IDE_Morph.prototype.toggleAppMode = function (appMode) {
    var world = this.world(),
        elements = [
            this.logo,
            this.controlBar.cloudButton,
            this.controlBar.projectButton,
            this.controlBar.settingsButton,
            this.controlBar.steppingButton,
            this.controlBar.stageSizeButton,
            this.paletteHandle,
            this.stageHandle,
            this.corral,
            this.corralBar,
            this.spriteEditor,
            this.spriteBar,
            this.palette,
            this.categories
        ];

    this.isAppMode = isNil(appMode) ? !this.isAppMode : appMode;

    if (this.isAppMode) {
		this.wasSingleStepping = Process.prototype.enableSingleStepping;
		if (this.wasSingleStepping) {
     		this.toggleSingleStepping();
    	}
        this.setColor(this.appModeColor);
        this.controlBar.setColor(this.color);
        this.controlBar.appModeButton.refresh();
        elements.forEach(e =>
            e.hide()
        );
        world.children.forEach(morph => {
            if (morph instanceof DialogBoxMorph) {
                morph.hide();
            }
        });
        if (world.keyboardFocus instanceof ScriptFocusMorph) {
            world.keyboardFocus.stopEditing();
        }
    } else {
        if (this.wasSingleStepping && !Process.prototype.enableSingleStepping) {
             this.toggleSingleStepping();
        }
        this.setColor(this.backgroundColor);
        this.controlBar.setColor(this.frameColor);
        elements.forEach(e =>
            e.show()
        );
        this.stage.setScale(1);
        // show all hidden dialogs
        world.children.forEach(morph => {
            if (morph instanceof DialogBoxMorph) {
                morph.show();
            }
        });
        // prevent scrollbars from showing when morph appears
        world.allChildren().filter(c =>
            c instanceof ScrollFrameMorph
        ).forEach(s =>
            s.adjustScrollBars()
        );
        // prevent rotation and draggability controls from
        // showing for the stage
        if (this.currentSprite === this.stage) {
            this.spriteBar.children.forEach(child => {
                if (child instanceof PushButtonMorph) {
                    child.hide();
                }
            });
        }
        // update undrop controls
        this.currentSprite.scripts.updateToolbar();
        // hide hidden panes
        if (this.config.noSpriteEdits) {
            this.spriteBar.hide();
            this.stageHandle.hide();
            this.corralBar.hide();
            this.corral.hide();
        }
    }
    this.setExtent(this.world().extent());
};

IDE_Morph.prototype.toggleStageSize = function (isSmall, forcedRatio) {
    var myself = this,
        smallRatio = forcedRatio || 0.5,
        msecs = this.isAnimating ? 100 : 0,
        world = this.world(),
        shiftClicked = (world.currentKey === 16),
        altClicked = (world.currentKey === 18);

    function toggle() {
        myself.isSmallStage = isNil(isSmall) ? !myself.isSmallStage : isSmall;
    }

    function zoomTo(targetRatio) {
        myself.isSmallStage = true;
        world.animations.push(new Animation(
            ratio => {
                myself.stageRatio = ratio;
                myself.setExtent(world.extent());
            },
            () => myself.stageRatio,
            targetRatio - myself.stageRatio,
            msecs,
            null, // easing
            () => {
                myself.isSmallStage = (targetRatio !== 1);
                myself.controlBar.stageSizeButton.refresh();
            }
        ));
    }

    if (shiftClicked) {
        smallRatio = SpriteIconMorph.prototype.thumbSize.x * 3 /
            this.stage.dimensions.x;
        if (!this.isSmallStage || (smallRatio === this.stageRatio)) {
            toggle();
        }
    } else if (altClicked) {
        smallRatio = this.width() / 2 /
            this.stage.dimensions.x;
        if (!this.isSmallStage || (smallRatio === this.stageRatio)) {
            toggle();
        }
    } else {
        toggle();
    }
    if (this.isSmallStage) {
        zoomTo(smallRatio);
    } else {
        zoomTo(1);
    }
};

IDE_Morph.prototype.toggleUnifiedPalette = function () {
    this.setUnifiedPalette(!this.scene.unifiedPalette);
    this.recordUnsavedChanges();
};

IDE_Morph.prototype.setUnifiedPalette = function (bool) {
    // answer true or false indicating whether the palette
    // has already been refreshed by this operation
    if (this.scene.unifiedPalette === bool &&
        (bool === (this.currentCategory === 'unified'))
    ) {
        return false;
    }
    this.scene.unifiedPalette = bool;
    this.currentCategory = bool ? 'unified' : 'motion';
    this.createCategories();
    this.createPaletteHandle();
    this.categories.fixLayout();
    this.fixLayout();
    this.flushBlocksCache();
    this.categories.refreshEmpty();
    this.currentSprite.palette(this.currentCategory);
    this.refreshPalette(true);
    return true;
};

IDE_Morph.prototype.toggleCategoryNames = function () {
    this.scene.showCategories = !this.scene.showCategories;
    this.flushBlocksCache();
    this.refreshPalette();
    this.recordUnsavedChanges();
};

IDE_Morph.prototype.togglePaletteButtons = function () {
    this.scene.showPaletteButtons = !this.scene.showPaletteButtons;
    this.flushBlocksCache();
    this.refreshPalette();
    this.recordUnsavedChanges();
};

IDE_Morph.prototype.setPaletteWidth = function (newWidth) {
    var msecs = this.isAnimating ? 100 : 0,
        world = this.world();

    world.animations.push(new Animation(
        newWidth => {
            this.paletteWidth = newWidth;
            this.setExtent(world.extent());
        },
        () => this.paletteWidth,
        newWidth - this.paletteWidth,
        msecs
    ));
};

IDE_Morph.prototype.createNewProject = function () {
    this.backup(() => this.newProject());
};

IDE_Morph.prototype.addScene = function () {
    var setting = this.isAddingScenes;
    if (location.protocol === 'file:') {
        // bypass the project import dialog and directly pop up
        // the local file picker.
        // this should not be necessary, we should be able
        // to access the cloud even when running Snap! locally
        // to be worked on.... (jens)
        this.isAddingScenes = true;
        this.importLocalFile();
        this.isAddingScenes = setting;
        return;
    }
    new ProjectDialogMorph(this, 'add').popUp();
};

IDE_Morph.prototype.openProjectsBrowser = function () {
    if (location.protocol === 'file:') {
        // bypass the project import dialog and directly pop up
        // the local file picker.
        // this should not be necessary, we should be able
        // to access the cloud even when running Snap! locally
        // to be worked on.... (jens)
        this.importLocalFile();
        return;
    }
    new ProjectDialogMorph(this, 'open').popUp();
};

IDE_Morph.prototype.saveProjectsBrowser = function () {
    // temporary hack - only allow exporting projects to disk
    // when running Snap! locally without a web server
    if (location.protocol === 'file:') {
        this.prompt(
            'Export Project As...',
            name => this.exportProject(name),
            null,
            'exportProject'
        );
        return;
    }

    if (this.source === 'examples') {
        this.source = null; // cannot save to examples
    }
    new ProjectDialogMorph(this, 'save').popUp();
};

// IDE_Morph microphone settings

IDE_Morph.prototype.microphoneMenu = function () {
    var menu = new MenuMorph(this),
        world = this.world(),
        pos = this.controlBar.settingsButton.bottomLeft(),
        resolutions = ['low', 'normal', 'high', 'max'],
        microphone = this.stage.microphone,
        tick = new SymbolMorph(
            'tick',
            MorphicPreferences.menuFontSize * 0.75
        ),
        on = new SymbolMorph(
            'checkedBox',
            MorphicPreferences.menuFontSize * 0.75
        ),
        empty = tick.fullCopy();

    empty.render = nop;
    if (microphone.isReady) {
        menu.addItem(
            [
                on,
                localize('Microphone')
            ],
            () => microphone.stop()
        );
        menu.addLine();
    }
    resolutions.forEach((res, i) => {
        menu.addItem(
            [
                microphone.resolution === i + 1 ? tick : empty,
                localize(res)
            ],
            () => microphone.setResolution(i + 1)
        );
    });
    menu.popup(world, pos);
};

// IDE_Morph localization

IDE_Morph.prototype.languageMenu = function () {
    var menu = new MenuMorph(this),
        world = this.world(),
        pos = this.controlBar.settingsButton.bottomLeft(),
        tick = new SymbolMorph(
            'tick',
            MorphicPreferences.menuFontSize * 0.75
        ),
        empty = tick.fullCopy();

    empty.render = nop;
    SnapTranslator.languages().forEach(lang =>
        menu.addItem(
            [
                SnapTranslator.language === lang ? tick : empty,
                SnapTranslator.languageName(lang)
            ],
            () => {
                this.loadNewProject = false;
                this.setLanguage(
                    lang,
                    () => this.stage.fireUserEditEvent(
                        this.currentSprite.name,
                        ['project', 'language', lang],
                        this.version
                    )
                );
            }
        )
    );
    menu.popup(world, pos);
};

IDE_Morph.prototype.setLanguage = function (lang, callback, noSave) {
    var translation = document.getElementById('language'),
        src;
    SnapTranslator.unload();
    if (translation) {
        document.head.removeChild(translation);
    }
    if (!(lang in SnapTranslator.dict)) {
        if (lang.includes('_') && lang.split('_')[0] in SnapTranslator.dict) {
            lang = lang.split('_')[0];
        } else {
            lang = 'en';
        }
    }
    if (lang === 'en') {
        return this.reflectLanguage('en', callback, noSave);
    }

    src = this.resourceURL('locale', 'lang-' + lang + '.js');
    translation = document.createElement('script');
    translation.id = 'language';
    translation.onload = () =>
        this.reflectLanguage(lang, callback, noSave);
    document.head.appendChild(translation);
    translation.src = src;
};

IDE_Morph.prototype.reflectLanguage = function (lang, callback, noSave) {
    var projectData,
        urlBar = location.hash;
    SnapTranslator.language = lang;
    if (!this.loadNewProject) {
        this.scene.captureGlobalSettings();
        if (Process.prototype.isCatchingErrors) {
            try {
                projectData = this.serializer.serialize(
                    new Project(this.scenes, this.scene)
                );
            } catch (err) {
                this.showMessage('Serialization failed: ' + err);
            }
        } else {
            projectData = this.serializer.serialize(
                new Project(this.scenes, this.scene)
            );
        }
    }
    SpriteMorph.prototype.initBlocks();
    this.spriteBar.tabBar.tabTo('scripts');
    this.createCategories();
    this.categories.refreshEmpty();
    this.createCorralBar();
    this.refreshCustomizedPalette();
    this.fixLayout();
    if (this.loadNewProject) {
        this.newProject();
        location.hash = urlBar;
        if (callback) {callback.call(this); }
    } else {
        this.openProjectString(projectData, callback);
    }
    if (!noSave) {
        this.saveSetting('language', lang);
    }
};

// IDE_Morph design settings

IDE_Morph.prototype.looksMenu = function () {
    this.looksMenuData().popup(
        this.world(),
        this.controlBar.settingsButton.bottomLeft()
    );
};

IDE_Morph.prototype.looksMenuData = function () {
    var menu = new MenuMorph(this),
        world = this.world(),
        shiftClicked = (world.currentKey === 16),
        tick = new SymbolMorph(
            'tick',
            MorphicPreferences.menuFontSize * 0.75
        ),
        empty = tick.fullCopy(),
        on = new SymbolMorph(
            'checkedBox',
            MorphicPreferences.menuFontSize * 0.75
        ),
        off = new SymbolMorph(
            'rectangle',
            MorphicPreferences.menuFontSize * 0.75
        );

    menu.addPreference = function (label, toggle, test, onHint, offHint, hide) {
        if (!hide || shiftClicked) {
            menu.addItem(
                [
                    (test? on : off),
                    localize(label)
                ],
                toggle,
                test ? onHint : offHint,
                hide ? new Color(100, 0, 0) : null
            );
        }
    };

    empty.render = nop;

    menu.addItem(
        [
            MorphicPreferences.isFlat || IDE_Morph.prototype.isBright ? empty
                : tick,
            localize('Default')
        ],
        this.defaultLooks
    );
    menu.addItem(
        [
            MorphicPreferences.isFlat && IDE_Morph.prototype.isBright ? tick
                : empty,
            localize('Flat Bright')
        ],
        this.flatBrightLooks
    );
    menu.addLine();
    menu.addPreference(
        'Flat design',
        () => {
            if (MorphicPreferences.isFlat) {
                return this.defaultDesign();
            }
            this.flatDesign();
        },
        MorphicPreferences.isFlat,
        'uncheck for default\nGUI design',
        'check for alternative\nGUI design',
        false
    );
    menu.addPreference(
        'Bright theme',
        () => {
            if (IDE_Morph.prototype.isBright) {
                return this.defaultTheme();
            }
            this.brightTheme();
        },
        IDE_Morph.prototype.isBright,
        'uncheck for default\nGUI theme',
        'check for alternative\nGUI theme',
        false
    );
    return menu;
};

// IDE_Morph blocks scaling

IDE_Morph.prototype.userSetBlocksScale = function () {
    var scrpt,
        blck,
        shield,
        sample,
        action,
        dlg;

    scrpt = new CommandBlockMorph();
    scrpt.color = SpriteMorph.prototype.blockColor.motion;
    scrpt.setSpec(localize('build'));
    blck = new CommandBlockMorph();
    blck.color = SpriteMorph.prototype.blockColor.sound;
    blck.setSpec(localize('your own'));
    scrpt.nextBlock(blck);
    blck = new CommandBlockMorph();
    blck.color = SpriteMorph.prototype.blockColor.operators;
    blck.setSpec(localize('blocks'));
    scrpt.bottomBlock().nextBlock(blck);
    /*
    blck = SpriteMorph.prototype.blockForSelector('doForever');
    blck.inputs()[0].nestedBlock(scrpt);
    */

    sample = new FrameMorph();
    sample.acceptsDrops = false;
    sample.color = IDE_Morph.prototype.groupColor;
    if (!MorphicPreferences.isFlat &&
            SyntaxElementMorph.prototype.alpha > 0.8) {
        sample.cachedTexture = this.scriptsTexture();
    }
    sample.setExtent(new Point(250, 180));
    scrpt.setPosition(sample.position().add(10));
    sample.add(scrpt);

    shield = new Morph();
    shield.alpha = 0;
    shield.setExtent(sample.extent());
    shield.setPosition(sample.position());
    sample.add(shield);

    action = (num) => {
        scrpt.blockSequence().forEach(block => {
            block.setScale(num);
            block.setSpec(block.blockSpec);
        });
        scrpt.fullChanged();
    };

    dlg = new DialogBoxMorph(
        null,
        num => this.setBlocksScale(Math.min(num, 12))
    ).withKey('zoomBlocks');
    if (MorphicPreferences.isTouchDevice) {
        dlg.isDraggable = false;
    }
    dlg.prompt(
        'Zoom blocks',
        SyntaxElementMorph.prototype.scale.toString(),
        this.world(),
        sample, // pic
        {
            'normal (1x)' : 1,
            'demo (1.2x)' : 1.2,
            'presentation (1.4x)' : 1.4,
            'big (2x)' : 2,
            'huge (4x)' : 4,
            'giant (8x)' : 8,
            'monstrous (10x)' : 10
        },
        false, // read only?
        true, // numeric
        1, // slider min
        5, // slider max
        action // slider action
    );
};

IDE_Morph.prototype.setBlocksScale = function (num) {
    var projectData;
    this.scene.captureGlobalSettings();
    if (Process.prototype.isCatchingErrors) {
        try {
            projectData = this.serializer.serialize(
                new Project(this.scenes, this.scene)
            );
        } catch (err) {
            this.showMessage('Serialization failed: ' + err);
        }
    } else {
        projectData = this.serializer.serialize(
            new Project(this.scenes, this.scene)
        );
    }
    SpriteMorph.prototype.initBlocks();
    SyntaxElementMorph.prototype.setScale(num);
    CommentMorph.prototype.refreshScale();
    this.spriteBar.tabBar.tabTo('scripts');
    this.createCategories();
    this.categories.refreshEmpty();
    this.createCorralBar();
    this.refreshCustomizedPalette();
    this.fixLayout();
    this.openProjectString(projectData);
    this.saveSetting('zoom', num);
};

// IDE_Morph blocks fading

IDE_Morph.prototype.userFadeBlocks = function () {
    var dlg,
        initial = 100 - (SyntaxElementMorph.prototype.alpha * 100);

    dlg = new DialogBoxMorph(
        null,
        num => this.setBlockTransparency(num, true) // and save setting
    ).withKey('fadeBlocks');
    if (MorphicPreferences.isTouchDevice) {
        dlg.isDraggable = false;
    }

    dlg.cancel = () => {
        this.setBlockTransparency(initial);
        dlg.destroy();
    };

    dlg.prompt(
        'Fade blocks',
        initial.toString(),
        this.world(),
        null, // pic
        {
            'block-solid (0)' : 0,
            'medium (50)' : 50,
            'light (70)' : 70,
            'shimmering (80)' : 80,
            'elegant (90)' : 90,
            'subtle (95)' : 95,
            'text-only (100)' : 100
        },
        false, // read only?
        true, // numeric
        0, // slider min
        100, // slider max
        num => this.setBlockTransparency(num), // slider action
        0 // decimals
    );
};

IDE_Morph.prototype.setBlockTransparency = function (num, save) {
    SyntaxElementMorph.prototype.setAlphaScaled(100 - num);
    this.changed();
    if (save) {
        if (num === 0) {
            this.removeSetting('fade');
        } else {
            this.saveSetting('fade', num);
        }
    }
};

// IDE_Morph blocks scaling

IDE_Morph.prototype.userSetBlocksAfterglow = function () {
    var glow = ThreadManager.prototype.afterglow,
        scrpt,
        blck,
        shield,
        sample,
        action,
        timeout,
        dlg;

    scrpt = new CommandBlockMorph();
    scrpt.color = SpriteMorph.prototype.blockColor.motion;
    scrpt.setSpec(localize('build'));
    blck = new CommandBlockMorph();
    blck.color = SpriteMorph.prototype.blockColor.sound;
    blck.setSpec(localize('your own'));
    scrpt.nextBlock(blck);
    blck = new CommandBlockMorph();
    blck.color = SpriteMorph.prototype.blockColor.operators;
    blck.setSpec(localize('blocks'));
    scrpt.bottomBlock().nextBlock(blck);

    sample = new FrameMorph();
    sample.acceptsDrops = false;
    sample.color = IDE_Morph.prototype.groupColor;
    if (!MorphicPreferences.isFlat &&
            SyntaxElementMorph.prototype.alpha > 0.8) {
        sample.cachedTexture = this.scriptsTexture();
    }
    sample.setExtent(new Point(250, 180));
    scrpt.setPosition(sample.position().add(10));
    sample.add(scrpt);

    shield = new Morph();
    shield.alpha = 0;
    shield.setExtent(sample.extent());
    shield.setPosition(sample.position());
    shield.mouseClickLeft = () => action(glow);
    sample.add(shield);

    action = (num) => {
        glow = num;
        if (!isNil(timeout)) {
            clearTimeout(timeout);
        }
        if (!scrpt.getHighlight()) {
            scrpt.addHighlight();
        }
        timeout = setTimeout(
            () => scrpt.removeHighlight(),
            num * 16,67
        );
    };

    dlg = new DialogBoxMorph(
        null,
        num => this.setBlocksAfterglow(Math.max(0, Math.min(num, 20)))
    ).withKey('afterglow');
    if (MorphicPreferences.isTouchDevice) {
        dlg.isDraggable = false;
    }
    dlg.prompt(
        'Afterglow blocks',
        ThreadManager.prototype.afterglow.toString(),
        this.world(),
        sample, // pic
        {
            'off (0x)' : 0,
            'short (1x)' : 1,
            'normal (5x)' : 5,
            'long (10x)' : 10,
            'maximum (20x)' : 20
        },
        false, // read only?
        true, // numeric
        0, // slider min
        20, // slider max
        action, // slider action
        0 // decimals
    );
};

IDE_Morph.prototype.setBlocksAfterglow = function (num) {
    ThreadManager.prototype.afterglow = num;
    if (num === 5) {
        this.removeSetting('glow');
    } else {
        this.saveSetting('glow', num);
    }
};

// IDE_Morph stage size manipulation

IDE_Morph.prototype.userSetStageSize = function () {
    new DialogBoxMorph(
        this,
        this.setStageExtent,
        this
    ).promptVector(
        "Stage size",
        this.stage.dimensions,
        new Point(480, 360),
        'Stage width',
        'Stage height',
        this.world(),
        null, // pic
        null // msg
    );
};

IDE_Morph.prototype.setStageExtent = function (aPoint) {
    var myself = this,
        world = this.world(),
        ext = aPoint.max(new Point(240, 180));

    function zoom() {
        myself.step = function () {
            var delta = ext.subtract(
                myself.stage.dimensions
            ).divideBy(2);
            if (delta.abs().lt(new Point(5, 5))) {
                myself.stage.dimensions = ext;
                delete myself.step;
            } else {
                myself.stage.dimensions =
                    myself.stage.dimensions.add(delta);
            }
            myself.stage.setExtent(myself.stage.dimensions);
            myself.stage.clearPenTrails();
            myself.fixLayout();
            this.setExtent(world.extent());
        };
    }

    if (this.performerMode) {
        this.performerMode = false;
        this.buildPanes();
        this.fixLayout();
        this.selectSprite(this.currentSprite);
    }

    this.stageRatio = 1;
    this.isSmallStage = false;
    this.controlBar.stageSizeButton.refresh();
    this.stage.stopVideo();
    this.setExtent(world.extent());
    Costume.prototype.maxDimensions = aPoint;
    this.stage.stopVideo();
    this.stage.stopProjection();
    if (this.isAnimating) {
        zoom();
    } else {
        this.stage.dimensions = ext;
        this.stage.setExtent(this.stage.dimensions);
        this.stage.clearPenTrails();
        this.fixLayout();
        this.setExtent(world.extent());
    }
};

// IDE_Morph dragging threshold (internal feature)

IDE_Morph.prototype.userSetDragThreshold = function () {
    new DialogBoxMorph(
        this,
        num => MorphicPreferences.grabThreshold = Math.min(
            Math.max(+num, 0),
            200
        ),
        this
    ).prompt(
        "Dragging threshold",
        MorphicPreferences.grabThreshold.toString(),
        this.world(),
        null, // pic
        null, // choices
        null, // read only
        true // numeric
    );
};

// IDE_Morph customize primitives

IDE_Morph.prototype.userCustomizePalette = function (callback = nop) {
    // highly experimental for v10 - tweak the palette blocks,
    // e.g. replace all primitives with custom block definitions etc.
    var projectData;
    this.scene.captureGlobalSettings();
    if (Process.prototype.isCatchingErrors) {
        try {
            projectData = this.serializer.serialize(
                new Project(this.scenes, this.scene)
            );
        } catch (err) {
            this.showMessage('Serialization failed: ' + err);
        }
    } else {
        projectData = this.serializer.serialize(
            new Project(this.scenes, this.scene)
        );
    }
    SpriteMorph.prototype.initBlocks();
    callback();
    this.spriteBar.tabBar.tabTo('scripts');
    this.createCategories();
    this.categories.refreshEmpty();
    this.createCorralBar();
    this.fixLayout();
    this.openProjectString(projectData, null, true); // no prims
};

// IDE_Morph cloud interface

IDE_Morph.prototype.initializeCloud = function () {
    var world = this.world();
    new DialogBoxMorph(
        null,
        user => this.cloud.login(
            user.username.toLowerCase(),
            user.password,
            user.choice,
            (username, role, response) => {
                sessionStorage.username = username;
                this.controlBar.cloudButton.refresh();
                this.source = 'cloud';
                if (!isNil(response.days_left)) {
                    var duration = response.days_left + ' day' +
                        (response.days_left > 1 ? 's' : '');
                    new DialogBoxMorph().inform(
                        'Unverified account: ' + duration + ' left' +
                        'You are now logged in, and your account\n' +
                        'is enabled for ' + duration + '.\n' +
                        'Please use the verification link that\n' +
                        'was sent to your email address when you\n' +
                        'signed up.\n\n' +
                        'If you cannot find that email, please\n' +
                        'check your spam folder. If you still\n' +
                        'cannot find it, please use the "Resend\n' +
                        'Verification Email..." option in the cloud\n' +
                        'menu.\n\n' +
                        'You have ' + duration + ' left.',
                        world,
                        this.cloudIcon(null, new Color(0, 180, 0))
                    );
                } else if (response.title) {
                    new DialogBoxMorph().inform(
                        response.title,
                        response.message,
                        world,
                        this.cloudIcon(null, new Color(0, 180, 0))
                    );
                } else {
                    this.showMessage(response.message, 2);
                }
            },
            this.cloudError()
        )
    ).withKey('cloudlogin').promptCredentials(
        'Sign in',
        'login',
        null,
        null,
        null,
        null,
        'stay signed in on this computer\nuntil logging out',
        world,
        this.cloudIcon(),
        this.cloudMsg
    );
};

IDE_Morph.prototype.createCloudAccount = function () {
    var world = this.world();

    new DialogBoxMorph(
        null,
        user => this.cloud.signup(
            user.username,
            user.password,
            user.passwordRepeat,
            user.email,
            (txt, title) => new DialogBoxMorph().inform(
                title,
                txt + '.\n\nYou can now log in.',
                world,
                this.cloudIcon(null, new Color(0, 180, 0))
            ),
            this.cloudError()
        )
    ).withKey('cloudsignup').promptCredentials(
        'Sign up',
        'signup',
        'https://snap.berkeley.edu/tos.html',
        'Terms of Service...',
        'https://snap.berkeley.edu/privacy.html',
        'Privacy...',
        'I have read and agree\nto the Terms of Service',
        world,
        this.cloudIcon(),
        this.cloudMsg
    );
};

IDE_Morph.prototype.resetCloudPassword = function () {
    var world = this.world();

    new DialogBoxMorph(
        null,
        user => this.cloud.resetPassword(
            user.username,
            (txt, title) => new DialogBoxMorph().inform(
                title,
                txt +
                    '\n\nAn e-mail with a link to\n' +
                    'reset your password\n' +
                    'has been sent to the address provided',
                world,
                this.cloudIcon(null, new Color(0, 180, 0))
            ),
            this.cloudError()
        )
    ).withKey('cloudresetpassword').promptCredentials(
        'Reset password',
        'resetPassword',
        null,
        null,
        null,
        null,
        null,
        world,
        this.cloudIcon(),
        this.cloudMsg
    );
};

IDE_Morph.prototype.resendVerification = function () {
    var world = this.world();

    new DialogBoxMorph(
        null,
        user => this.cloud.resendVerification(
            user.username,
            (txt, title) => new DialogBoxMorph().inform(
                title,
                txt,
                world,
                this.cloudIcon(null, new Color(0, 180, 0))
            ),
            this.cloudError()
        )
    ).withKey('cloudresendverification').promptCredentials(
        'Resend verification email',
        'resendVerification',
        null,
        null,
        null,
        null,
        null,
        world,
        this.cloudIcon(),
        this.cloudMsg
    );
};

IDE_Morph.prototype.changeCloudPassword = function () {
    var world = this.world();

    new DialogBoxMorph(
        null,
        user => this.cloud.changePassword(
            user.oldpassword,
            user.password,
            user.passwordRepeat,
            () => this.showMessage('password has been changed.', 2),
            this.cloudError()
        )
    ).withKey('cloudpassword').promptCredentials(
        'Change Password',
        'changePassword',
        null,
        null,
        null,
        null,
        null,
        world,
        this.cloudIcon(),
        this.cloudMsg
    );
};

IDE_Morph.prototype.logout = function () {
    this.cloud.logout(
        () => {
            delete(sessionStorage.username);
            this.controlBar.cloudButton.refresh();
            this.showMessage('disconnected.', 2);
        },
        () => {
            delete(sessionStorage.username);
            this.controlBar.cloudButton.refresh();
            this.showMessage('disconnected.', 2);
        }
    );
};

IDE_Morph.prototype.buildProjectRequest = function () {
    var proj = new Project(this.scenes, this.scene),
        body,
        xml;

    this.scene.captureGlobalSettings();
    this.serializer.isCollectingMedia = true;
    xml = this.serializer.serialize(proj);
    body = {
        notes: proj.notes,
        xml: xml,
        /*
        media: this.hasChangedMedia ? // incremental media upload, disabled
            this.serializer.mediaXML(proj.name) : null,
        */
        media: this.serializer.mediaXML(proj.name),
        thumbnail: proj.thumbnail.toDataURL(),
        remixID: this.stage.remixID
    };
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();
    this.scene.applyGlobalSettings();

    return body;
};

IDE_Morph.prototype.verifyProject = function (body) {
    // Ensure the project is less than 10MB and serializes correctly.
    var encodedBody = JSON.stringify(body);
    if (encodedBody.length > Cloud.MAX_FILE_SIZE) {
        new DialogBoxMorph().inform(
            'Snap!Cloud - Cannot Save Project',
            'The media inside this project exceeds 10 MB.\n' +
                'Please reduce the size of costumes or sounds.\n',
            this.world(),
            this.cloudIcon(null, new Color(180, 0, 0))
        );
        return false;
    }

    // console.log(encodedBody.length);
    // check if serialized data can be parsed back again
    try {
        this.serializer.parse(body.xml);
    } catch (err) {
        this.showMessage('Serialization of program data failed:\n' + err);
        return false;
    }
    if (body.media !== null) {
        try {
            this.serializer.parse(body.media);
        } catch (err) {
            this.showMessage('Serialization of media failed:\n' + err);
            return false;
        }
    }
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();

    return encodedBody.length;
};

IDE_Morph.prototype.saveProjectToCloud = function (name) {
    var projectBody, projectSize;

    if (name) {
        name = this.setProjectName(name);
    }

    this.showMessage('Saving project\nto the cloud...');
    projectBody = this.buildProjectRequest();
    projectSize = this.verifyProject(projectBody);
    if (!projectSize) {return; } // Invalid Projects don't return anything.
    this.showMessage(
        'Uploading ' + Math.round(projectSize / 1024) + ' KB...'
    );
    this.cloud.saveProject(
        this.getProjectName(),
        projectBody,
        () => {
            this.recordSavedChanges();
            this.showMessage('saved.', 2);
        },
        this.cloudError()
    );
};

IDE_Morph.prototype.exportProjectMedia = function (name) {
    var menu, media;
    this.scene.captureGlobalSettings();
    this.serializer.isCollectingMedia = true;
    if (name) {
        this.setProjectName(name);
        try {
            menu = this.showMessage('Exporting');
            this.serializer.serialize(new Project(this.scenes, this.scene));
            media = this.serializer.mediaXML(name);
            this.saveXMLAs(media, this.getProjectName() + ' media');
            menu.destroy();
            this.showMessage('Exported!', 1);
        } catch (err) {
            if (Process.prototype.isCatchingErrors) {
                this.serializer.isCollectingMedia = false;
                this.showMessage('Export failed: ' + err);
            } else {
                throw err;
            }
        }
    }
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();
    // this.hasChangedMedia = false;
};

IDE_Morph.prototype.exportProjectNoMedia = function (name) {
    var menu, str;
    this.scene.captureGlobalSettings();
    this.serializer.isCollectingMedia = true;
    if (name) {
        name = this.setProjectName(name);
        if (Process.prototype.isCatchingErrors) {
            try {
                menu = this.showMessage('Exporting');
                str = this.serializer.serialize(
                    new Project(this.scenes, this.scene)
                );
                this.saveXMLAs(str, name);
                menu.destroy();
                this.showMessage('Exported!', 1);
            } catch (err) {
                this.serializer.isCollectingMedia = false;
                this.showMessage('Export failed: ' + err);
            }
        } else {
            menu = this.showMessage('Exporting');
            str = this.serializer.serialize(
                new Project(this.scenes, this.scene)
            );
            this.saveXMLAs(str, name);
            menu.destroy();
            this.showMessage('Exported!', 1);
        }
    }
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();
};

IDE_Morph.prototype.exportProjectAsCloudData = function (name) {
    var menu, str, media, dta;
    this.scene.captureGlobalSettings();
    this.serializer.isCollectingMedia = true;
    if (name) {
        name = this.setProjectName(name);
        if (Process.prototype.isCatchingErrors) {
            try {
                menu = this.showMessage('Exporting');
                str = this.serializer.serialize(
                    new Project(this.scenes, this.scene)
                );
                media = this.serializer.mediaXML(name);
                dta = '<snapdata>' + str + media + '</snapdata>';
                this.saveXMLAs(dta, name);
                menu.destroy();
                this.showMessage('Exported!', 1);
            } catch (err) {
                this.serializer.isCollectingMedia = false;
                this.showMessage('Export failed: ' + err);
            }
        } else {
            menu = this.showMessage('Exporting');
            str = this.serializer.serialize(
                new Project(this.scenes, this.scene)
            );
            media = this.serializer.mediaXML(name);
            dta = '<snapdata>' + str + media + '</snapdata>';
            this.saveXMLAs(str, name);
            menu.destroy();
            this.showMessage('Exported!', 1);
        }
    }
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();
    // this.hasChangedMedia = false;
};

IDE_Morph.prototype.cloudAcknowledge = function () {
    return (responseText, url) => {
        nop(responseText);
        new DialogBoxMorph().inform(
            'Cloud Connection',
            'Successfully connected to:\n'
                + 'http://'
                + url,
            this.world(),
            this.cloudIcon(null, new Color(0, 180, 0))
        );
    };
};

IDE_Morph.prototype.cloudResponse = function () {
    return (responseText, url) => {
        var response = responseText;
        if (response.length > 50) {
            response = response.substring(0, 50) + '...';
        }
        new DialogBoxMorph().inform(
            'Snap!Cloud',
            'http://'
                + url + ':\n\n'
                + 'responds:\n'
                + response,
            this.world(),
            this.cloudIcon(null, new Color(0, 180, 0))
        );
    };
};

IDE_Morph.prototype.cloudError = function () {
    return (responseText, url) => {
        // first, try to find out an explanation for the error
        // and notify the user about it,
        // if none is found, show an error dialog box
        var response = responseText,
            // explanation = getURL('https://snap.berkeley.edu/cloudmsg.txt'),
            explanation = null;
        if (this.shield) {
            this.shield.destroy();
            this.shield = null;
        }
        if (explanation) {
            this.showMessage(explanation);
            return;
        }
        new DialogBoxMorph().inform(
            'Snap!Cloud',
            (url ? url + '\n' : '')
                + response,
            this.world(),
            this.cloudIcon(null, new Color(180, 0, 0))
        );
    };
};

IDE_Morph.prototype.cloudIcon = function (height, color) {
    var clr = color || DialogBoxMorph.prototype.titleBarColor,
        isFlat = MorphicPreferences.isFlat,
        icon = new SymbolMorph(
            isFlat ? 'cloud' : 'cloudGradient',
            height || 50,
            clr,
            isFlat ? null : new Point(-1, -1),
            clr.darker(50)
        );
    if (!isFlat) {
        icon.addShadow(new Point(1, 1), 1, clr.lighter(95));
    }
    return icon;
};

IDE_Morph.prototype.setCloudURL = function () {
    new DialogBoxMorph(
        null,
        url => {
            this.cloud.url = url;
            this.cloud.checkCredentials(
                () => this.controlBar.cloudButton.refresh(),
                () => this.controlBar.cloudButton.refresh()
            );
        }
    ).withKey('cloudURL').prompt(
        'Cloud URL',
        this.cloud.url,
        this.world(),
        null,
        this.cloud.knownDomains
    );
};

IDE_Morph.prototype.urlParameters = function () {
    var parameters = location.hash.slice(location.hash.indexOf(':') + 1);
    return this.cloud.parseDict(parameters);
};

IDE_Morph.prototype.hasCloudProject = function () {
    var params = this.urlParameters();
    return params.hasOwnProperty('Username') &&
        params.hasOwnProperty('ProjectName');
};

// IDE_Morph HTTP data fetching

IDE_Morph.prototype.getURL = function (url, callback, responseType) {
    // fetch the contents of a url and pass it into the specified callback.
    // If no callback is specified synchronously fetch and return it
    // Note: Synchronous fetching has been deprecated and should be switched
    // Note: Do Not attemp to prevent caching of requests.
    //   This has caused issues for BJC and the finch.
    var request = new XMLHttpRequest(),
        async = callback instanceof Function,
        rsp;
    if (async) {
        request.responseType = responseType || 'text';
    }
    rsp = (!async || request.responseType === 'text') ? 'responseText'
        : 'response';
    try {
        request.open('GET', url, async);
        if (async) {
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request[rsp]) {
                        callback.call(
                            this,
                            request[rsp]
                        );
                    } else {
                        this.showMessage('unable to retrieve ' + url);
                        throw new Error('unable to retrieve ' + url);
                    }
                }
            };
        }
        request.send();
        if (!async) {
            if (request.status === 200) {
                return request[rsp];
            }
            throw new Error('unable to retrieve ' + url);
        }
    } catch (err) {
        this.showMessage(err.toString());
        if (async) {
            callback.call(this);
        } else {
            return request[rsp];
        }
    }
};

// IDE_Morph serialization helper ops

IDE_Morph.prototype.blocksLibraryXML = function (
    definitions,
    moreCategories,
    asFile,
    dataFrame, // optional: include global variable dependencies in libraries
    localData // optional: include sprite-local variable dependencies
) {
    // answer an XML string encoding of an array of CustomBlockDefinitions
    var prims = definitions.filter(def => def.isGlobal && def.selector),
        globals = definitions.filter(def => def.isGlobal && !def.selector),
        locals = definitions.filter(def => !def.isGlobal),
        primStr = prims.length ? this.serializer.serialize(prims, true) : '',
        glbStr = globals.length ? this.serializer.serialize(globals, true) : '',
        locStr = locals.length ? this.serializer.serialize(locals, true) : '',
        dtaStr = dataFrame && dataFrame.names(true).length ?
            this.serializer.serialize(dataFrame, true)
            : '',
        ldtStr = localData && localData.names(true).length ?
            this.serializer.serialize(localData, true)
            : '',
        cats = moreCategories || [],
        appStr = ' app="' +
            this.serializer.app +
            '" version="' +
            this.serializer.version +
            '"';

    return '<blocks' +
        (asFile ? appStr : '' ) +
        '>' +
        this.paletteXML(definitions.map(def => def.category).concat(cats)) +
        (globals.length ? glbStr : '') +
        (prims.length ? ('<primitives>' + primStr + '</primitives>') : '') +
        (locals.length ? ('<local>' + locStr + '</local>') : '') +
        (dtaStr ? '<variables>' + dtaStr + '</variables>' : '') +
        (ldtStr ? '<local-variables>' + ldtStr + '</local-variables>' : '') +
        '</blocks>';
};

IDE_Morph.prototype.paletteXML = function (categoryNames) {
    // answer an XML string containing the palette information
    // found in an array of category names
    var palette = new Map();
    categoryNames.forEach(cat => {
        if (SpriteMorph.prototype.customCategories.has(cat)) {
            palette.set(
                cat,
                SpriteMorph.prototype.customCategories.get(cat)
            );
        }
    });
    return this.serializer.paletteToXML(palette);
};

// IDE_Morph user dialog shortcuts

IDE_Morph.prototype.showMessage = function (message, secs, atHand = false) {
    var m = new MenuMorph(null, message),
        intervalHandle;
    if (atHand) {
        m.popUpCenteredAtHand(this.world());
    } else {
        m.popUpCenteredInWorld(this.world());
    }
    if (secs) {
        intervalHandle = setInterval(
            () => {
                m.destroy();
                clearInterval(intervalHandle);
            },
            secs * 1000
        );
    }
    return m;
};

IDE_Morph.prototype.inform = function (title, message) {
    return new DialogBoxMorph().inform(
        title,
        localize(message),
        this.world()
    );
};

IDE_Morph.prototype.confirm = function (message, title, action) {
    new DialogBoxMorph(null, action).askYesNo(
        title,
        localize(message),
        this.world()
    );
};

IDE_Morph.prototype.prompt = function (message, callback, choices, key) {
    (new DialogBoxMorph(null, callback)).withKey(key).prompt(
        message,
        '',
        this.world(),
        null,
        choices
    );
};

// IDE_Morph bracing against IE

IDE_Morph.prototype.warnAboutIE = function () {
    var dlg, txt;
    if (this.isIE()) {
        dlg = new DialogBoxMorph();
        txt = new TextMorph(
            'Please do not use Internet Explorer.\n' +
                'Snap! runs best in a web-standards\n' +
                'compliant browser',
            dlg.fontSize,
            dlg.fontStyle,
            true,
            false,
            'center',
            null,
            null,
            MorphicPreferences.isFlat ? null : new Point(1, 1),
            WHITE
        );

        dlg.key = 'IE-Warning';
        dlg.labelString = "Internet Explorer";
        dlg.createLabel();
        dlg.addBody(txt);
        dlg.fixLayout();
        dlg.popUp(this.world());
        dlg.nag = true;
    }
};

IDE_Morph.prototype.isIE = function () {
    var ua = navigator.userAgent;
    return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
};

// IDE_Morph warn about saving project in the dev version

IDE_Morph.prototype.warnAboutDev = function () {
    if (!SnapVersion.includes('-dev') || this.config.noDevWarning) {
        return;
    }
    this.inform(
        "CAUTION! Development Version",
        'This version of Snap! is being developed.\n' +
            '*** It is NOT supported for end users. ***\n' +
            'Saving a project in THIS version is likely to\n' +
            'make it UNUSABLE or DEFECTIVE for current and\n' +
            'even future official versions!\n\n' +
            'visit https://snap.berkeley.edu/run\n' +
            'for the official Snap! installation.'
    ).nag = true;
};

// ProjectDialogMorph ////////////////////////////////////////////////////

// ProjectDialogMorph inherits from DialogBoxMorph:

ProjectDialogMorph.prototype = new DialogBoxMorph();
ProjectDialogMorph.prototype.constructor = ProjectDialogMorph;
ProjectDialogMorph.uber = DialogBoxMorph.prototype;

// ProjectDialogMorph instance creation:

function ProjectDialogMorph(ide, label) {
    this.init(ide, label);
}

ProjectDialogMorph.prototype.init = function (ide, task) {
    // additional properties:
    this.ide = ide;
    this.task = task || 'open'; // String describing what do do (open, save)
    this.source = ide.source;
    this.projectList = []; // [{name: , thumb: , notes:}]

    this.handle = null;
    this.srcBar = null;
    this.nameField = null;
    this.filterField = null;
    this.magnifyingGlass = null;
    this.listField = null;
    this.preview = null;
    this.notesText = null;
    this.notesField = null;
    this.deleteButton = null;
    this.shareButton = null;
    this.unshareButton = null;
    this.publishButton = null;
    this.unpublishButton = null;
    this.recoverButton = null;

    // initialize inherited properties:
    ProjectDialogMorph.uber.init.call(
        this,
        this, // target
        null, // function
        null // environment
    );

    // override inherited properites:
    switch (this.task) {
    case 'save':
        this.labelString = 'Save Project';
        break;
    case 'add':
        this.labelString = 'Add Scene';
        break;
    default: // 'open'
        this.task = 'open';
        this.labelString = 'Open Project';
    }

    this.createLabel();
    this.key = 'project' + task;

    // build contents
    if ((task === 'open' || task === 'add') && this.source === 'disk') {
        // give the user a chance to switch to another source
        this.source = null;
        this.buildContents();
        this.projectList = [];
        this.listField.hide();
        this.source = 'disk';
    } else {
        this.buildContents();
        this.onNextStep = () => // yield to show "updating" message
            this.setSource(this.source);
    }
};

ProjectDialogMorph.prototype.buildContents = function () {
    var thumbnail, notification;

    this.addBody(new Morph());
    this.body.color = this.color;

    this.srcBar = new AlignmentMorph('column', this.padding / 2);

    if (this.ide.cloudMsg) {
        notification = new TextMorph(
            this.ide.cloudMsg,
            10,
            null, // style
            false, // bold
            null, // italic
            null, // alignment
            null, // width
            null, // font name
            new Point(1, 1), // shadow offset
            WHITE // shadowColor
        );
        notification.refresh = nop;
        this.srcBar.add(notification);
    }

    if (!this.ide.cloud.disabled) {
        this.addSourceButton('cloud', localize('Cloud'), 'cloud');
    }

    if (this.task === 'open' || this.task === 'add') {
        this.buildFilterField();
        this.addSourceButton('examples', localize('Examples'), 'poster');
        if (this.hasLocalProjects() || this.ide.world().currentKey === 16) {
            // shift- clicked
            this.addSourceButton('local', localize('Browser'), 'globe');
        }
    }
    this.addSourceButton('disk', localize('Computer'), 'storage');

    this.srcBar.fixLayout();
    this.body.add(this.srcBar);

    if (this.task === 'save') {
        this.nameField = new InputFieldMorph(this.ide.getProjectName());
        this.body.add(this.nameField);
    }

    this.listField = new ListMorph([]);
    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.render = InputFieldMorph.prototype.render;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.body.add(this.listField);

    this.preview = new Morph();
    this.preview.fixLayout = nop;
    this.preview.edge = InputFieldMorph.prototype.edge;
    this.preview.fontSize = InputFieldMorph.prototype.fontSize;
    this.preview.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.preview.contrast = InputFieldMorph.prototype.contrast;
    this.preview.render = function (ctx) {
        InputFieldMorph.prototype.render.call(this, ctx);
        if (this.cachedTexture) {
            this.renderCachedTexture(ctx);
        } else if (this.texture) {
            this.renderTexture(this.texture, ctx);
        }
    };
    this.preview.renderCachedTexture = function (ctx) {
        ctx.drawImage(this.cachedTexture, this.edge, this.edge);
    };
    this.preview.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;
    this.preview.setExtent(
        this.ide.serializer.thumbnailSize.add(this.preview.edge * 2)
    );

    this.body.add(this.preview);
    if (this.task === 'save') {
        thumbnail = this.ide.scenes.at(1).stage.thumbnail(
            SnapSerializer.prototype.thumbnailSize
        );
        this.preview.texture = null;
        this.preview.cachedTexture = thumbnail;
        this.preview.rerender();
    }

    this.notesField = new ScrollFrameMorph();
    this.notesField.fixLayout = nop;

    this.notesField.edge = InputFieldMorph.prototype.edge;
    this.notesField.fontSize = InputFieldMorph.prototype.fontSize;
    this.notesField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.notesField.contrast = InputFieldMorph.prototype.contrast;
    this.notesField.render = InputFieldMorph.prototype.render;
    this.notesField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.notesField.acceptsDrops = false;
    this.notesField.contents.acceptsDrops = false;

    if (this.task === 'open' || this.task === 'add') {
        this.notesText = new TextMorph('');
    } else { // 'save'
        this.notesText = new TextMorph(this.ide.getProjectNotes());
        this.notesText.isEditable = true;
        this.notesText.enableSelecting();
    }

    this.notesField.isTextLineWrapping = true;
    this.notesField.padding = 3;
    this.notesField.setContents(this.notesText);
    this.notesField.setWidth(this.preview.width());

    this.body.add(this.notesField);

    if (this.task === 'open') {
        this.addButton('openProject', 'Open');
        this.action = 'openProject';
        this.recoverButton = this.addButton('recoveryDialog', 'Recover', true);
        this.recoverButton.hide();
    } else if (this.task === 'add') {
        this.addButton('addScene', 'Add');
        this.action = 'addScene';
        this.recoverButton = this.addButton('recoveryDialog', 'Recover', true);
        this.recoverButton.hide();
    } else { // 'save'
        this.addButton('saveProject', 'Save');
        this.action = 'saveProject';
    }
    this.shareButton = this.addButton('shareProject', 'Share', true);
    this.unshareButton = this.addButton('unshareProject', 'Unshare', true);
    this.shareButton.hide();
    this.unshareButton.hide();
    this.publishButton = this.addButton('publishProject', 'Publish', true);
    this.unpublishButton = this.addButton(
        'unpublishProject',
        'Unpublish',
        true
    );
    this.publishButton.hide();
    this.unpublishButton.hide();
    this.deleteButton = this.addButton('deleteProject', 'Delete');
    this.addButton('cancel', 'Cancel');

    if (notification) {
        this.setExtent(new Point(500, 360).add(notification.extent()));
    } else {
        this.setExtent(new Point(500, 360));
    }
    this.fixLayout();

};

ProjectDialogMorph.prototype.popUp = function (wrrld) {
    var world = wrrld || this.ide.world();
    if (world) {
        ProjectDialogMorph.uber.popUp.call(this, world);
        this.handle = new HandleMorph(
            this,
            350,
            330,
            this.corner,
            this.corner
        );
    }
};

// ProjectDialogMorph action buttons

ProjectDialogMorph.prototype.createButtons = function () {
    if (this.buttons) {
        this.buttons.destroy();
    }
    this.buttons = new AlignmentMorph('column', this.padding / 3);
    this.buttons.bottomRow = new AlignmentMorph('row', this.padding);
    this.buttons.topRow = new AlignmentMorph('row', this.padding);
    this.buttons.add(this.buttons.topRow);
    this.buttons.add(this.buttons.bottomRow);
    this.add(this.buttons);

    this.buttons.fixLayout = function () {
        if (this.topRow.children.some(function (any) {
            return any.isVisible;
        })) {
            this.topRow.show();
            this.topRow.fixLayout();
        } else {
            this.topRow.hide();
        }
        this.bottomRow.fixLayout();
        AlignmentMorph.prototype.fixLayout.call(this);
    };
};

ProjectDialogMorph.prototype.addButton = function (action, label, topRow) {
    var button = new PushButtonMorph(
        this,
        action || 'ok',
        '  ' + localize((label || 'OK')) + '  '
    );
    button.fontSize = this.buttonFontSize;
    button.corner = this.buttonCorner;
    button.edge = this.buttonEdge;
    button.outline = this.buttonOutline;
    button.outlineColor = this.buttonOutlineColor;
    button.outlineGradient = this.buttonOutlineGradient;
    button.padding = this.buttonPadding;
    button.contrast = this.buttonContrast;
    button.fixLayout();
    if (topRow) {
        this.buttons.topRow.add(button);
    } else {
        this.buttons.bottomRow.add(button);
    }
    return button;
};

// ProjectDialogMorph source buttons

ProjectDialogMorph.prototype.addSourceButton = function (
    source,
    label,
    symbol
) {
    var lbl1 = new StringMorph(
            label,
            10,
            null,
            true,
            null,
            null,
            new Point(1, 1),
            WHITE
        ),
        lbl2 = new StringMorph(
            label,
            10,
            null,
            true,
            null,
            null,
            new Point(-1, -1),
            this.titleBarColor.darker(50),
            WHITE
        ),
        l1 = new Morph(),
        l2 = new Morph(),
        button;

    lbl1.add(new SymbolMorph(
        symbol,
        24,
        this.titleBarColor.darker(20),
        new Point(1, 1),
        this.titleBarColor.darker(50)
    ));
    lbl1.children[0].setCenter(lbl1.center());
    lbl1.children[0].setBottom(lbl1.top() - this.padding / 2);

    l1.isCachingImage = true;
    l1.cachedImage = lbl1.fullImage();
    l1.bounds = lbl1.fullBounds();

    lbl2.add(new SymbolMorph(
        symbol,
        24,
        WHITE,
        new Point(-1, -1),
        this.titleBarColor.darker(50)
    ));
    lbl2.children[0].setCenter(lbl2.center());
    lbl2.children[0].setBottom(lbl2.top() - this.padding / 2);

    l2.isCachingImage = true;
    l2.cachedImage = lbl2.fullImage();
    l2.bounds = lbl2.fullBounds();

    button = new ToggleButtonMorph(
        null, //colors,
        this, // the ProjectDialog is the target
        () => this.setSource(source), // action
        [l1, l2],
        () => this.source === source // query
    );

    button.corner = this.buttonCorner;
    button.edge = this.buttonEdge;
    button.outline = this.buttonOutline;
    button.outlineColor = this.buttonOutlineColor;
    button.outlineGradient = this.buttonOutlineGradient;
    button.labelMinExtent = new Point(60, 0);
    button.padding = this.buttonPadding;
    button.contrast = this.buttonContrast;
    button.pressColor = this.titleBarColor.darker(20);
    button.fixLayout();
    button.refresh();
    this.srcBar.add(button);
};

// ProjectDialogMorph list field control

ProjectDialogMorph.prototype.fixListFieldItemColors = function () {
    // remember to always fixLayout() afterwards for the changes
    // to take effect
    this.listField.contents.children[0].alpha = 0;
    this.listField.contents.children[0].children.forEach(item => {
        item.pressColor = this.titleBarColor.darker(20);
        item.color = new Color(0, 0, 0, 0);
    });
};

// ProjectDialogMorph filter field

ProjectDialogMorph.prototype.buildFilterField = function () {
    var myself = this;

    this.filterField = new InputFieldMorph('');
    this.magnifyingGlass = new SymbolMorph(
        'magnifyingGlass',
        this.filterField.height(),
        this.titleBarColor.darker(50)
    );

    this.body.add(this.magnifyingGlass);
    this.body.add(this.filterField);

    this.filterField.reactToInput = function (evt) {
        var text = this.getValue();

        myself.listField.elements =
            myself.projectList.filter(aProject => {
                var name = aProject.projectname || aProject.name,
                    notes = aProject.notes || '';
                return name.toLowerCase().indexOf(text.toLowerCase()) > -1 ||
                    notes.toLowerCase().indexOf(text.toLowerCase()) > -1;
            });

        if (myself.listField.elements.length === 0) {
            myself.listField.elements.push('(no matches)');
        }

        myself.clearDetails();
        myself.listField.buildListContents();
        myself.fixListFieldItemColors();
        myself.listField.adjustScrollBars();
        myself.listField.scrollY(myself.listField.top());
        myself.fixLayout();
    };
};

// ProjectDialogMorph ops

ProjectDialogMorph.prototype.setSource = function (source) {
    var msg, setting;

    this.source = source;
    this.srcBar.children.forEach(button =>
        button.refresh()
    );

    switch (this.source) {
    case 'cloud':
        msg = this.ide.showMessage('Updating\nproject list...');
        this.projectList = [];
        this.ide.cloud.getProjectList(
            response => {
                // Don't show cloud projects if user has since switched panes.
                if (this.source === 'cloud') {
                    this.installCloudProjectList(response.projects);
                }
                msg.destroy();
            },
            (err, lbl) => {
                msg.destroy();
                this.ide.cloudError().call(null, err, lbl);
            }
        );
        return;
    case 'examples':
        this.projectList = this.getExamplesProjectList();
        break;
    case 'local':
        // deprecated, only for reading
        this.projectList = this.getLocalProjectList();
        break;
    case 'disk':
        if (this.task === 'save') {
            this.projectList = [];
        } else {
            this.destroy();
            if (this.task === 'add') {
                setting = this.ide.isAddingScenes;
                this.ide.isAddingScenes = true;
                this.ide.importLocalFile();
                this.ide.isAddingScenes = setting;
            } else {
                this.ide.importLocalFile();
            }
            return;
        }
        break;
    }

    this.listField.destroy();
    this.listField = new ListMorph(
        this.projectList,
        this.projectList.length > 0 ?
            (element) => {return element.name || element; }
                : null,
        null,
        () => this.ok()
    );
    if (this.source === 'disk') {
        this.listField.hide();
    }

    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.render = InputFieldMorph.prototype.render;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    if (this.source === 'local') {
        this.listField.action = (item) => {
            var src, xml;
            if (item === undefined) {return; }
            if (this.nameField) {
                this.nameField.setContents(item.name || '');
            }
            if (this.task === 'open') {
                src = localStorage['-snap-project-' + item.name];
                if (src) {
                    xml = this.ide.serializer.parse(src);
                    this.notesText.text =
                        xml.childNamed('notes').contents || '';
                    this.notesText.rerender();
                    this.notesField.contents.adjustBounds();
                    this.preview.texture =
                        xml.childNamed('thumbnail').contents || null;
                    this.preview.cachedTexture = null;
                    this.preview.rerender();
                }
            }
            this.edit();
        };
    } else { // 'examples'; 'cloud' is initialized elsewhere
        this.listField.action = (item) => {
            var src, xml;
            if (item === undefined) {return; }
            if (this.nameField) {
                this.nameField.setContents(item.name || '');
            }
            src = this.ide.getURL(
                this.ide.resourceURL('Examples', item.fileName)
            );
            xml = this.ide.serializer.parse(src);
            this.notesText.text = xml.childNamed('notes').contents || '';
            this.notesText.rerender();
            this.notesField.contents.adjustBounds();
            this.preview.texture = xml.childNamed('thumbnail').contents || null;
            this.preview.cachedTexture = null;
            this.preview.rerender();
            this.edit();
        };
    }
    this.body.add(this.listField);
    this.shareButton.hide();
    this.unshareButton.hide();

    if (this.task === 'open' || this.task === 'add') {
        this.recoverButton.hide();
    }

    this.publishButton.hide();
    this.unpublishButton.hide();
    if (this.source === 'local') {
        this.deleteButton.show();
    } else { // examples
        this.deleteButton.hide();
    }
    this.buttons.fixLayout();
    this.fixLayout();
    if (this.task === 'open' || this.task === 'add') {
        this.clearDetails();
    }
};

ProjectDialogMorph.prototype.hasLocalProjects = function () {
    // check and report whether old projects still exist in the
    // browser's local storage, which as of v5 has been deprecated,
    // so the user can recover and move them elsewhere
    return Object.keys(localStorage).some(any =>
        any.indexOf('-snap-project-') === 0
    );
};

ProjectDialogMorph.prototype.getLocalProjectList = function () {
    var stored, name, dta,
        projects = [];
    for (stored in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, stored)
                && stored.substr(0, 14) === '-snap-project-') {
            name = stored.substr(14);
            dta = {
                name: name,
                thumb: null,
                notes: null
            };
            projects.push(dta);
        }
    }
    projects.sort((x, y) =>
        x.name.toLowerCase() < y.name.toLowerCase() ? -1 : 1
    );
    return projects;
};

ProjectDialogMorph.prototype.getExamplesProjectList = function () {
    return this.ide.getMediaList('Examples');
};

ProjectDialogMorph.prototype.installCloudProjectList = function (pl) {
    this.projectList = pl[0] ? pl : [];
    this.projectList.sort((x, y) =>
        x.projectname.toLowerCase() < y.projectname.toLowerCase() ? -1 : 1
    );

    this.listField.destroy();
    this.listField = new ListMorph(
        this.projectList,
        this.projectList.length > 0 ?
            (element) => {return element.projectname || element; }
                : null,
        [ // format: display shared project names bold
            [
                'bold',
                proj => proj.ispublic
            ],
            [
                'italic',
                proj => proj.ispublished
            ]
        ],
        () => this.ok()
    );
    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.render = InputFieldMorph.prototype.render;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.listField.action = (item) => {
        if (item === undefined) {return; }
        if (this.nameField) {
            this.nameField.setContents(item.projectname || '');
        }
        if (this.task === 'open' || this.task === 'add') {
            this.notesText.text = item.notes || '';
            this.notesText.rerender();
            this.notesField.contents.adjustBounds();
            this.preview.texture = '';
            this.preview.rerender();
            // we ask for the thumbnail when selecting a project
            this.ide.cloud.getThumbnail(
                null, // username is implicit
                item.projectname,
                thumbnail => {
                    this.preview.texture = thumbnail;
                    this.preview.cachedTexture = null;
                    this.preview.rerender();
                });
            new SpeechBubbleMorph(new TextMorph(
                localize('last changed') + '\n' + item.lastupdated,
                null,
                null,
                null,
                null,
                'center'
            )).popUp(
                this.world(),
                this.preview.rightCenter().add(new Point(2, 0))
            );
        }
        if (item.ispublic) {
            this.shareButton.hide();
            this.unshareButton.show();
            if (item.ispublished) {
                this.publishButton.hide();
                this.unpublishButton.show();
            } else {
                this.publishButton.show();
                this.unpublishButton.hide();
            }
        } else {
            this.unshareButton.hide();
            this.shareButton.show();
            this.publishButton.hide();
            this.unpublishButton.hide();
        }
        this.buttons.fixLayout();
        this.fixLayout();
        this.edit();
    };
    this.body.add(this.listField);
    if (this.task === 'open' || this.task === 'add') {
        this.recoverButton.show();
    }
    this.shareButton.show();
    this.unshareButton.hide();
    this.deleteButton.show();
    this.buttons.fixLayout();
    this.fixLayout();
    if (this.task === 'open' || this.task === 'add') {
        this.clearDetails();
    }
};

ProjectDialogMorph.prototype.clearDetails = function () {
    this.notesText.text = '';
    this.notesText.rerender();
    this.notesField.contents.adjustBounds();
    this.preview.texture = null;
    this.preview.cachedTexture = null;
    this.preview.rerender();
};

ProjectDialogMorph.prototype.recoveryDialog = function () {
    var proj = this.listField.selected;
    if (!proj) {return; }
    this.removeShadow();
    this.hide();
    new ProjectRecoveryDialogMorph(this.ide, proj.projectname, this).popUp();
};

ProjectDialogMorph.prototype.addScene = function () {
    var proj = this.listField.selected,
        src;
    if (!proj) {return; }
    this.ide.isAddingNextScene = true;
    this.ide.source = this.source;
    if (this.source === 'cloud') {
        this.addCloudScene(proj);
    } else if (this.source === 'examples') {
        // Note "file" is a property of the parseResourceFile function.
        src = this.ide.getURL(this.ide.resourceURL('Examples', proj.fileName));
        this.ide.openProjectString(src);
        this.destroy();

    } else { // 'local'
        this.ide.source = null;
        this.ide.openProjectName(proj.name);
        this.destroy();
    }
};

ProjectDialogMorph.prototype.openProject = function () {
    var proj = this.listField.selected,
        src;
    if (!proj) {return; }
    this.ide.source = this.source;
    if (this.source === 'cloud') {
        this.openCloudProject(proj);
    } else if (this.source === 'examples') {
        // Note "file" is a property of the parseResourceFile function.
        src = this.ide.getURL(this.ide.resourceURL('Examples', proj.fileName));
        this.ide.backup(() => this.ide.openProjectString(src));
        this.destroy();

    } else { // 'local'
        this.ide.source = null;
        this.ide.backup(() => this.ide.openProjectName(proj.name));
        this.destroy();
    }
};

ProjectDialogMorph.prototype.addCloudScene = function (project, delta) {
    // no need to backup
    this.ide.nextSteps([
        () => this.ide.showMessage('Fetching project\nfrom the cloud...'),
        () => this.rawOpenCloudProject(project, delta)
    ]);
};

ProjectDialogMorph.prototype.openCloudProject = function (project, delta) {
    this.ide.backup(
        () => {
            SpriteMorph.prototype.initBlocks(); // reset prims
            this.ide.nextSteps([
                () => this.ide.showMessage('Fetching project\nfrom the cloud...'),
                () => this.rawOpenCloudProject(project, delta)
            ]);
        }
    );
};

ProjectDialogMorph.prototype.rawOpenCloudProject = function (proj, delta) {
    this.ide.cloud.getProject(
        proj.projectname,
        delta,
        clouddata => {
            this.ide.source = 'cloud';
            this.ide.nextSteps([
                () => this.ide.openCloudDataString(clouddata)
            ]);
			location.hash = '';
            if (proj.ispublic) {
                location.hash = '#present:Username=' +
                    encodeURIComponent(this.ide.cloud.username) +
                    '&ProjectName=' +
                    encodeURIComponent(proj.projectname);
            }
        },
        this.ide.cloudError()
    );
    this.destroy();
};

ProjectDialogMorph.prototype.saveProject = function () {
    var name = this.nameField.contents().text.text,
        notes = this.notesText.text;

    if (this.ide.getProjectNotes() !== notes) {
        this.ide.setProjectNotes(notes);
    }
    if (name) {
        if (this.source === 'cloud') {
            if (detect(
                    this.projectList,
                    item => item.projectname === name
                )) {
                this.ide.confirm(
                    localize(
                        'Are you sure you want to replace'
                    ) + '\n"' + name + '"?',
                    'Replace Project',
                    () => {
                        this.ide.setProjectName(name);
                        this.saveCloudProject();
                    }
                );
            } else {
                this.ide.setProjectName(name);
                this.saveCloudProject();
            }
        } else if (this.source === 'disk') {
            this.ide.exportProject(name);
            this.ide.source = 'disk';
            this.destroy();
        }
    }
};

ProjectDialogMorph.prototype.saveCloudProject = function () {
    this.ide.source = 'cloud';
    this.ide.saveProjectToCloud();
    this.destroy();
};

ProjectDialogMorph.prototype.deleteProject = function () {
    var proj,
        idx,
        name;

    if (this.source === 'cloud') {
        proj = this.listField.selected;
        if (proj) {
            this.ide.confirm(
                localize(
                    'Are you sure you want to delete'
                ) + '\n"' + proj.projectname + '"?',
                'Delete Project',
                () => this.ide.cloud.deleteProject(
                    proj.projectname,
                    null, // username is implicit
                    () => {
                        this.ide.hasChangedMedia = true;
                        idx = this.projectList.indexOf(proj);
                        this.projectList.splice(idx, 1);
                        this.installCloudProjectList( // refresh list
                            this.projectList
                        );
                    },
                    this.ide.cloudError()
                )
            );
        }
    } else { // 'local, examples'
        if (this.listField.selected) {
            name = this.listField.selected.name;
            this.ide.confirm(
                localize(
                    'Are you sure you want to delete'
                ) + '\n"' + name + '"?',
                'Delete Project',
                () => {
                    delete localStorage['-snap-project-' + name];
                    this.setSource(this.source); // refresh list
                }
            );
        }
    }
};

ProjectDialogMorph.prototype.shareProject = function () {
    var ide = this.ide,
        proj = this.listField.selected,
        entry = this.listField.active;

    if (proj) {
        this.ide.confirm(
            localize(
                'Are you sure you want to share'
            ) + '\n"' + proj.projectname + '"?',
            'Share Project',
            () => {
                ide.showMessage('sharing\nproject...');
                ide.cloud.shareProject(
                    proj.projectname,
                    null, // username is implicit
                    () => {
                        proj.ispublic = true;
                        this.unshareButton.show();
                        this.shareButton.hide();
                        this.publishButton.show();
                        this.unpublishButton.hide();
                        entry.label.isBold = true;
                        entry.label.rerender();
                        this.buttons.fixLayout();
                        this.rerender();
                        this.ide.showMessage('shared.', 2);

                        // Set the Shared URL if the project is currently open
                        if (proj.projectname === ide.getProjectName()) {
                            var usr = ide.cloud.username,
                                projectId = 'Username=' +
                                    encodeURIComponent(usr.toLowerCase()) +
                                    '&ProjectName=' +
                                    encodeURIComponent(proj.projectname);
                            location.hash = 'present:' + projectId;
                        }
                    },
                    this.ide.cloudError()
                );
            }
        );
    }
};

ProjectDialogMorph.prototype.unshareProject = function () {
    var ide = this.ide,
        proj = this.listField.selected,
        entry = this.listField.active;

    if (proj) {
        this.ide.confirm(
            localize(
                'Are you sure you want to unshare'
            ) + '\n"' + proj.projectname + '"?',
            'Unshare Project',
            () => {
                ide.showMessage('unsharing\nproject...');
                ide.cloud.unshareProject(
                    proj.projectname,
                    null, // username is implicit
                    () => {
                        proj.ispublic = false;
                        this.shareButton.show();
                        this.unshareButton.hide();
                        this.publishButton.hide();
                        this.unpublishButton.hide();
                        entry.label.isBold = false;
                        entry.label.isItalic = false;
                        entry.label.rerender();
                        this.buttons.fixLayout();
                        this.rerender();
                        this.ide.showMessage('unshared.', 2);
                        if (proj.projectname === ide.getProjectName()) {
                            location.hash = '';
                        }
                    },
                    this.ide.cloudError()
                );
            }
        );
    }
};

ProjectDialogMorph.prototype.publishProject = function () {
    var ide = this.ide,
        proj = this.listField.selected,
        entry = this.listField.active;

    if (proj) {
        this.ide.confirm(
            localize(
                'Are you sure you want to publish'
            ) + '\n"' + proj.projectname + '"?',
            'Publish Project',
            () => {
                ide.showMessage('publishing\nproject...');
                ide.cloud.publishProject(
                    proj.projectname,
                    null, // username is implicit
                    () => {
                        proj.ispublished = true;
                        this.unshareButton.show();
                        this.shareButton.hide();
                        this.publishButton.hide();
                        this.unpublishButton.show();
                        entry.label.isItalic = true;
                        entry.label.rerender();
                        this.buttons.fixLayout();
                        this.rerender();
                        this.ide.showMessage('published.', 2);

                        // Set the Shared URL if the project is currently open
                        if (proj.projectname === ide.getProjectName()) {
                            var usr = ide.cloud.username,
                                projectId = 'Username=' +
                                    encodeURIComponent(usr.toLowerCase()) +
                                    '&ProjectName=' +
                                    encodeURIComponent(proj.projectname);
                            location.hash = 'present:' + projectId;
                        }
                    },
                    this.ide.cloudError()
                );
            }
        );
    }
};

ProjectDialogMorph.prototype.unpublishProject = function () {
    var proj = this.listField.selected,
        entry = this.listField.active;

    if (proj) {
        this.ide.confirm(
            localize(
                'Are you sure you want to unpublish'
            ) + '\n"' + proj.projectname + '"?',
            'Unpublish Project',
            () => {
                this.ide.showMessage('unpublishing\nproject...');
                this.ide.cloud.unpublishProject(
                    proj.projectname,
                    null, // username is implicit
                    () => {
                        proj.ispublished = false;
                        this.unshareButton.show();
                        this.shareButton.hide();
                        this.publishButton.show();
                        this.unpublishButton.hide();
                        entry.label.isItalic = false;
                        entry.label.rerender();
                        this.buttons.fixLayout();
                        this.rerender();
                        this.ide.showMessage('unpublished.', 2);
                    },
                    this.ide.cloudError()
                );
            }
        );
    }
};

ProjectDialogMorph.prototype.edit = function () {
    if (this.nameField) {
        this.nameField.edit();
    } else if (this.filterField) {
        this.filterField.edit();
    }
};

// ProjectDialogMorph layout

ProjectDialogMorph.prototype.fixLayout = function () {
    var th = fontHeight(this.titleFontSize) + this.titlePadding * 2,
        thin = this.padding / 2,
        inputField = this.nameField || this.filterField;

    if (this.buttons && (this.buttons.children.length > 0)) {
        this.buttons.fixLayout();
    }

    if (this.body) {
        this.body.setPosition(this.position().add(new Point(
            this.padding,
            th + this.padding
        )));
        this.body.setExtent(new Point(
            this.width() - this.padding * 2,
            this.height() - this.padding * 3 - th - this.buttons.height()
        ));
        this.srcBar.setPosition(this.body.position());

        inputField.setWidth(
                this.body.width() - this.srcBar.width() - this.padding * 6
            );
        inputField.setLeft(this.srcBar.right() + this.padding * 3);
        inputField.setTop(this.srcBar.top());

        this.listField.setLeft(this.srcBar.right() + this.padding);
        this.listField.setWidth(
            this.body.width()
                - this.srcBar.width()
                - this.preview.width()
                - this.padding
                - thin
        );
        this.listField.contents.children[0].adjustWidths();

        this.listField.setTop(inputField.bottom() + this.padding);
        this.listField.setHeight(
            this.body.height() - inputField.height() - this.padding
        );

        if (this.magnifyingGlass) {
            this.magnifyingGlass.setTop(inputField.top());
            this.magnifyingGlass.setLeft(this.listField.left());
        }

        this.preview.setRight(this.body.right());
        this.preview.setTop(inputField.bottom() + this.padding);

        this.notesField.setTop(this.preview.bottom() + thin);
        this.notesField.setLeft(this.preview.left());
        this.notesField.setHeight(
            this.body.bottom() - this.preview.bottom() - thin
        );
    }

    if (this.label) {
        this.label.setCenter(this.center());
        this.label.setTop(this.top() + (th - this.label.height()) / 2);
    }

    if (this.buttons && (this.buttons.children.length > 0)) {
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    }

    // refresh shadow
    this.removeShadow();
    this.addShadow();
};

// ProjectRecoveryDialogMorph /////////////////////////////////////////
// I show previous versions for a particular project and
// let users recover them.

ProjectRecoveryDialogMorph.prototype = new DialogBoxMorph();
ProjectRecoveryDialogMorph.prototype.constructor = ProjectRecoveryDialogMorph;
ProjectRecoveryDialogMorph.uber = DialogBoxMorph.prototype;

// ProjectRecoveryDialogMorph instance creation:

function ProjectRecoveryDialogMorph(ide, project, browser) {
    this.init(ide, project, browser);
}

ProjectRecoveryDialogMorph.prototype.init = function (
    ide,
    projectName,
    browser
) {
    // initialize inherited properties:
    ProjectRecoveryDialogMorph.uber.init.call(
        this,
        this, // target
        null, // function
        null  // environment
    );

    this.ide = ide;
    this.browser = browser;
    this.key = 'recoverProject';
    this.projectName = projectName;

    this.versions = null;

    this.handle = null;
    this.listField = null;
    this.preview = null;
    this.notesText = null;
    this.notesField = null;

    this.labelString = 'Recover project';
    this.createLabel();

    this.buildContents();
};

ProjectRecoveryDialogMorph.prototype.buildContents = function () {
    this.addBody(new Morph());
    this.body.color = this.color;

    this.buildListField();

    this.preview = new Morph();
    this.preview.fixLayout = nop;
    this.preview.edge = InputFieldMorph.prototype.edge;
    this.preview.fontSize = InputFieldMorph.prototype.fontSize;
    this.preview.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.preview.contrast = InputFieldMorph.prototype.contrast;
    this.preview.render = function (ctx) {
        InputFieldMorph.prototype.render.call(this, ctx);
        if (this.cachedTexture) {
            this.renderCachedTexture(ctx);
        } else if (this.texture) {
            this.renderTexture(this.texture, ctx);
        }
    };
    this.preview.renderCachedTexture = function (ctx) {
        ctx.drawImage(this.cachedTexture, this.edge, this.edge);
    };
    this.preview.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;
    this.preview.setExtent(
        this.ide.serializer.thumbnailSize.add(this.preview.edge * 2)
    );

    this.body.add(this.preview);

    this.notesField = new ScrollFrameMorph();
    this.notesField.fixLayout = nop;

    this.notesField.edge = InputFieldMorph.prototype.edge;
    this.notesField.fontSize = InputFieldMorph.prototype.fontSize;
    this.notesField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.notesField.contrast = InputFieldMorph.prototype.contrast;
    this.notesField.render = InputFieldMorph.prototype.render;
    this.notesField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.notesField.acceptsDrops = false;
    this.notesField.contents.acceptsDrops = false;

    this.notesText = new TextMorph('');

    this.notesField.isTextLineWrapping = true;
    this.notesField.padding = 3;
    this.notesField.setContents(this.notesText);
    this.notesField.setWidth(this.preview.width());

    this.body.add(this.notesField);

    this.addButton('recoverProject', 'Recover', true);
    this.addButton('cancel', 'Cancel');

    this.setExtent(new Point(360, 300));
    this.fixLayout();
};

ProjectRecoveryDialogMorph.prototype.buildListField = function () {
    this.listField = new ListMorph([]);
    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.render = InputFieldMorph.prototype.render;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.listField.action = (item) => {
        var version;
        if (item === undefined) { return; }
        version = detect(
            this.versions,
            version => version.lastupdated === item
        );
        this.notesText.text = version.notes || '';
        this.notesText.rerender();
        this.notesField.contents.adjustBounds();
        this.preview.texture = version.thumbnail;
        this.preview.cachedTexture = null;
        this.preview.rerender();
    };

    this.ide.cloud.getProjectVersionMetadata(
        this.projectName,
        versions => {
            var today = new Date(),
                yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            this.versions = versions;
            this.versions.forEach(version => {
                var date = new Date(
                    new Date().getTime() - version.lastupdated * 1000
                );
                if (date.toDateString() === today.toDateString()) {
                    version.lastupdated = localize('Today, ') +
                        date.toLocaleTimeString();
                } else if (date.toDateString() === yesterday.toDateString()) {
                    version.lastupdated = localize('Yesterday, ') +
                        date.toLocaleTimeString();
                } else {
                    version.lastupdated = date.toLocaleString();
                }
            });
            this.listField.elements = this.versions.map(version =>
                version.lastupdated
            );
            this.clearDetails();
            this.listField.buildListContents();
            this.fixListFieldItemColors();
            this.listField.adjustScrollBars();
            this.listField.scrollY(this.listField.top());
            this.fixLayout();
        },
        this.ide.cloudError()
    );

    this.body.add(this.listField);
};

ProjectRecoveryDialogMorph.prototype.cancel = function () {
    this.browser.show();
    this.browser.listField.select(
        detect(
            this.browser.projectList,
            item => item.projectname === this.projectName
        )
    );
    ProjectRecoveryDialogMorph.uber.cancel.call(this);
};

ProjectRecoveryDialogMorph.prototype.recoverProject = function () {
    var lastupdated = this.listField.selected,
        version = detect(
            this.versions,
            version => version.lastupdated === lastupdated
        );

    this.browser.openCloudProject(
        {projectname: this.projectName},
        version.delta
    );
    this.destroy();
};

ProjectRecoveryDialogMorph.prototype.popUp = function () {
    var world = this.ide.world();
    if (world) {
        ProjectRecoveryDialogMorph.uber.popUp.call(this, world);
        this.handle = new HandleMorph(
            this,
            300,
            300,
            this.corner,
            this.corner
        );
    }
};

ProjectRecoveryDialogMorph.prototype.fixListFieldItemColors =
    ProjectDialogMorph.prototype.fixListFieldItemColors;

ProjectRecoveryDialogMorph.prototype.clearDetails =
    ProjectDialogMorph.prototype.clearDetails;

ProjectRecoveryDialogMorph.prototype.fixLayout = function () {
    var titleHeight = fontHeight(this.titleFontSize) + this.titlePadding * 2,
        thin = this.padding / 2;

    if (this.body) {
        this.body.setPosition(this.position().add(new Point(
            this.padding,
            titleHeight + this.padding
        )));
        this.body.setExtent(new Point(
            this.width() - this.padding * 2,
            this.height()
                - this.padding * 3 // top, bottom and button padding.
                - titleHeight
                - this.buttons.height()
        ));

        this.listField.setWidth(
            this.body.width()
                - this.preview.width()
                - this.padding
        );
        this.listField.contents.children[0].adjustWidths();

        this.listField.setPosition(this.body.position());
        this.listField.setHeight(this.body.height());

        this.preview.setRight(this.body.right());
        this.preview.setTop(this.listField.top());

        this.notesField.setTop(this.preview.bottom() + thin);
        this.notesField.setLeft(this.preview.left());
        this.notesField.setHeight(
            this.body.bottom() - this.preview.bottom() - thin
        );
    }

    if (this.label) {
        this.label.setCenter(this.center());
        this.label.setTop(
            this.top() + (titleHeight - this.label.height()) / 2
        );
    }

    if (this.buttons) {
        this.buttons.fixLayout();
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    }

    // refresh shadow
    this.removeShadow();
    this.addShadow();
};

// LibraryImportDialogMorph ///////////////////////////////////////////
// I am preview dialog shown before importing a library.
// I inherit from a DialogMorph but look similar to
// ProjectDialogMorph, and BlockImportDialogMorph

LibraryImportDialogMorph.prototype = new DialogBoxMorph();
LibraryImportDialogMorph.prototype.constructor = LibraryImportDialogMorph;
LibraryImportDialogMorph.uber = DialogBoxMorph.prototype;

// LibraryImportDialogMorph instance creation:

function LibraryImportDialogMorph(ide, librariesData) {
    this.init(ide, librariesData);
}

LibraryImportDialogMorph.prototype.init = function (ide, librariesData) {
    // additional properties
    this.isLoadingLibrary = false;
    this.originalCategories = null;
    this.captureOriginalCategories();

    // initialize inherited properties:
    LibraryImportDialogMorph.uber.init.call(
        this,
        this, // target
        null, // function
        null  // environment
    );

    this.ide = ide;
    this.key = 'importLibrary';
    this.action = 'importLibrary';

    // [{name: , fileName: , description:, categories:, searchData:}]
    this.librariesData = librariesData;
    this.filteredLibrariesList = this.librariesData;

    // I contain a cached version of the libaries I have displayed,
    // because users may choose to explore a library many times before
    // importing.
    this.libraryCache = new Map(); // fileName: { blocks: [], palette: {} }

    this.handle = null;
    this.filterField = null;
    this.listField = null;
    this.palette = null;
    this.notesText = null;
    this.notesField = null;

    this.labelString = 'Import library';
    this.createLabel();

    this.buildContents();
};

LibraryImportDialogMorph.prototype.captureOriginalCategories = function () {
    this.originalCategories = new Map();
    SpriteMorph.prototype.customCategories.forEach((color, name) =>
        this.originalCategories.set(name, color)
    );
};

LibraryImportDialogMorph.prototype.buildContents = function () {
    this.addBody(new Morph());
    this.body.color = this.color;
    this.buildFilterField();

    this.initializePalette();
    this.initializeLibraryDescription();
    this.installLibrariesList();

    this.addButton('ok', 'Import');
    this.addButton('cancel', 'Cancel');

    this.setExtent(new Point(500, 500));
    this.fixLayout();
};

// LibraryImportDialogMorph filter field

LibraryImportDialogMorph.prototype.buildFilterField = function () {
    var myself = this;

    function librarySearcText({name, description, categies, searchData}) {
        return [name, description, categies, searchData].join(' ').toLowerCase();
    }

    this.filterField = new InputFieldMorph('');
    this.magnifyingGlass = new SymbolMorph(
        'magnifyingGlass',
        this.filterField.height(),
        this.titleBarColor.darker(50)
    );

    this.body.add(this.magnifyingGlass);
    this.body.add(this.filterField);

    this.filterField.reactToInput = function (evt) {
        var text = this.getValue().toLowerCase();

        myself.filteredLibrariesList =
            myself.librariesData.filter(library =>
                librarySearcText(library).indexOf(text) > -1);

        if (myself.filteredLibrariesList.length === 0) {
            myself.filteredLibrariesList.push({
                name: localize('(no matches)'),
                fileName: null,
                description: null
            });
        }

        myself.clearDetails();
        myself.installLibrariesList();
        myself.fixListFieldItemColors();
        myself.listField.adjustScrollBars();
        myself.listField.scrollY(myself.listField.top());
        myself.fixLayout();
    };
};

LibraryImportDialogMorph.prototype.initializePalette = function () {
    // I will display a scrolling list of blocks.
    if (this.palette) {this.palette.destroy(); }

    this.palette = new ScrollFrameMorph(
        null,
        null,
        SpriteMorph.prototype.sliderColor
    );
    this.palette.color = SpriteMorph.prototype.paletteColor;
    this.palette.padding = 4;
    this.palette.isDraggable = false;
    this.palette.acceptsDrops = false;
    this.palette.contents.acceptsDrops = false;

    this.body.add(this.palette);
};

LibraryImportDialogMorph.prototype.initializeLibraryDescription = function () {
    if (this.notesField) {this.notesField.destroy(); }

    this.notesField = new ScrollFrameMorph();
    this.notesField.fixLayout = nop;

    this.notesField.edge = InputFieldMorph.prototype.edge;
    this.notesField.fontSize = InputFieldMorph.prototype.fontSize;
    this.notesField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.notesField.contrast = InputFieldMorph.prototype.contrast;
    this.notesField.render = InputFieldMorph.prototype.render;
    this.notesField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.notesField.acceptsDrops = false;
    this.notesField.contents.acceptsDrops = false;

    this.notesText = new TextMorph('');

    this.notesField.isTextLineWrapping = true;
    this.notesField.padding = 3;
    this.notesField.setContents(this.notesText);
    this.notesField.setHeight(100);

    this.body.add(this.notesField);
};

LibraryImportDialogMorph.prototype.installLibrariesList = function () {
    if (this.listField) {this.listField.destroy(); }

    this.listField = new ListMorph(
        this.filteredLibrariesList,
        element => element.name,
        null,
        () => this.importLibrary(),
        '~', // separator
        false // verbatim
    );

    this.fixListFieldItemColors();

    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.render = InputFieldMorph.prototype.render;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.listField.action = ({name, fileName, description}) => {
        if (isNil(name) || isNil(fileName)) {return; }

        this.notesText.text = localize(description) || '';
        this.notesText.rerender();
        this.notesField.contents.adjustBounds();

        if (this.hasCached(fileName)) {
            this.displayBlocks(fileName);
        } else {
            this.showMessage(`${localize('Loading')}\n${localize(name)}`);
            this.ide.getURL(
                this.ide.resourceURL('libraries', fileName),
                libraryXML => {
                    let serializer = this.ide.serializer,
                        palette = serializer.parse(
                            libraryXML
                        ).childNamed('palette');
                    this.cacheLibrary(
                        fileName,
                        serializer.loadBlocks(libraryXML, null, true),
                        palette ? serializer.loadPalette(palette) : {}
                    );
                    this.displayBlocks(fileName);
                }
            );
        }
    };

    this.body.add(this.listField);
    this.fixLayout();
};

LibraryImportDialogMorph.prototype.popUp = function () {
    var world = this.ide.world();
    if (world) {
        LibraryImportDialogMorph.uber.popUp.call(this, world);
        this.handle = new HandleMorph(
            this,
            500,
            500,
            this.corner,
            this.corner
        );
    }
};

LibraryImportDialogMorph.prototype.destroy = function () {
    LibraryImportDialogMorph.uber.destroy.call(this);
    if (!this.isLoadingLibrary) {
        SpriteMorph.prototype.customCategories = this.originalCategories;
    }
};

LibraryImportDialogMorph.prototype.fixListFieldItemColors =
    ProjectDialogMorph.prototype.fixListFieldItemColors;

LibraryImportDialogMorph.prototype.clearDetails = function () {
    this.notesText.text = '';
    this.notesText.rerender();
    this.notesField.contents.adjustBounds();
    this.initializePalette();
};

LibraryImportDialogMorph.prototype.fixLayout = function () {
    var titleHeight = fontHeight(this.titleFontSize) + this.titlePadding * 2,
        thin = this.padding / 2,
        inputField = this.filterField;

    if (this.body) {
        this.body.setPosition(this.position().add(new Point(
            this.padding,
            titleHeight + this.padding
        )));
        this.body.setExtent(new Point(
            this.width() - this.padding * 2,
            this.height()
                - this.padding * 4 // top, bottom, filterfield, button padding
                - titleHeight
                - this.buttons.height()
        ));

        if (this.magnifyingGlass) {
            this.magnifyingGlass.setTop(inputField.top());
            this.magnifyingGlass.setLeft(this.body.left());
        }

        inputField.setWidth(
            this.body.width() - this.padding - this.magnifyingGlass.width()
        );
        inputField.setLeft(this.magnifyingGlass.left() + this.padding * 2);
        inputField.setTop(this.body.top());

        this.listField.setLeft(this.body.left());
        this.listField.setWidth(240);

        this.listField.setTop(inputField.bottom() + this.padding);
        this.listField.setHeight(
            this.body.height() - inputField.height()
        );
        this.listField.contents.children[0].adjustWidths();

        this.notesField.setExtent(new Point(
            this.body.width() - this.listField.width() - thin,
            100
        ));
        this.palette.setExtent(new Point(
            this.body.width() - this.listField.width() - thin,
            this.body.height() -
                this.filterField.height() -
                this.notesField.height() -
                thin
        ));

        this.palette.setPosition(this.listField.topRight().add(
            new Point(thin, 0)
        ));
        this.notesField.setPosition(this.palette.bottomLeft().add(
            new Point(0, thin)
        ));
    }

    if (this.label) {
        this.label.setCenter(this.center());
        this.label.setTop(
            this.top() + (titleHeight - this.label.height()) / 2
        );
    }

    if (this.buttons) {
        this.buttons.fixLayout();
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    }

    this.removeShadow();
    this.addShadow();
};

// Library Cache Utilities.
LibraryImportDialogMorph.prototype.hasCached = function (key) {
    return this.libraryCache.hasOwnProperty(key);
};

LibraryImportDialogMorph.prototype.cacheLibrary = function (
    key,
    blocks,
    palette
) {
    this.libraryCache.set(key, { blocks, palette });
};

LibraryImportDialogMorph.prototype.cachedLibrary = function (key) {
    return this.libraryCache.get(key).blocks;
};

LibraryImportDialogMorph.prototype.cachedPalette = function (key) {
    return this.libraryCache.get(key).palette;
};

LibraryImportDialogMorph.prototype.importLibrary = function () {
    if (!this.listField.selected) {return; }

    var ide = this.ide,
        selectedLibrary = this.listField.selected.fileName,
        libraryName = this.listField.selected.name;

    // restore captured user-blocks categories
    SpriteMorph.prototype.customCategories = this.originalCategories;

    /*
    // importing previously cached blocks is disabled because
    // of customized primitives, which aren't installed for caching
    // to prevent polluting the project's palette
    // code retained for reference, -jens (01/2025)

    if (this.hasCached(selectedLibrary)) {
        this.cachedLibrary(selectedLibrary).forEach(def => {
            def.receiver = ide.stage;
            ide.stage.globalBlocks.push(def);
            ide.stage.replaceDoubleDefinitionsFor(def);
        });
        this.cachedPalette(selectedLibrary).forEach((value, key) =>
            SpriteMorph.prototype.customCategories.set(key, value)
        );
        ide.showMessage(`${localize('Imported')} ${libraryName}`, 2);
    } else {
        ide.showMessage(`${localize('Loading')} ${libraryName}`);
        ide.getURL(
            ide.resourceURL('libraries', selectedLibrary),
            libraryText => {
                ide.droppedText(libraryText, libraryName);
                this.isLoadingLibrary = true;
            }
        );
    }
    */

    ide.showMessage(`${localize('Loading')} ${libraryName}`);
    ide.getURL(
        ide.resourceURL('libraries', selectedLibrary),
        libraryText => {
            ide.droppedText(libraryText, libraryName);
            this.isLoadingLibrary = true;
        }
    );
};

LibraryImportDialogMorph.prototype.displayBlocks = function (libraryKey) {
    var x, y, blockImage, blockContainer, text,
        padding = 4,
        libraryBlocks = this.cachedLibrary(libraryKey),
        blocksByCategory = new Map(
            SpriteMorph.prototype.allCategories().map(cat => [cat, []])
        );

    // populate palette, grouped by categories.
    this.initializePalette();
    x = this.palette.left() + padding;
    y = this.palette.top();

    libraryBlocks.global.concat(libraryBlocks.local).forEach(definition => {
        if (!definition.isHelper) {
            blocksByCategory.get(definition.category).push(definition);
        }
    });

    blocksByCategory.forEach((blocks, category) => {
        if (blocks.length > 0) {
            text = SpriteMorph.prototype.categoryText(category);
            text.setPosition(new Point(x, y));
            this.palette.addContents(text);
            y += text.fullBounds().height() + padding;
        }

        blocks.forEach(definition => {
            blockImage = definition.templateInstance().fullImage();
            blockContainer = new Morph();
            blockContainer.isCachingImage = true;
            blockContainer.bounds.setWidth(blockImage.width);
            blockContainer.bounds.setHeight(blockImage.height);
            blockContainer.cachedImage = blockImage;
            blockContainer.setPosition(new Point(x, y));
            this.palette.addContents(blockContainer);

            y += blockContainer.fullBounds().height() + padding;
        });
    });

    this.palette.scrollX(padding);
    this.palette.scrollY(padding);
    this.fixLayout();
};

LibraryImportDialogMorph.prototype.showMessage = function (msgText) {
    var msg = new MenuMorph(null, msgText);
    this.initializePalette();
    this.fixLayout();
    msg.popUpCenteredInWorld(this.palette.contents);
};

// SpriteIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the Sprite corral, keeping a self-updating
    thumbnail of the sprite I'm respresenting, and a self-updating label
    of the sprite's name (in case it is changed elsewhere)
*/

// SpriteIconMorph inherits from ToggleButtonMorph (Widgets)

SpriteIconMorph.prototype = new ToggleButtonMorph();
SpriteIconMorph.prototype.constructor = SpriteIconMorph;
SpriteIconMorph.uber = ToggleButtonMorph.prototype;

// SpriteIconMorph settings

SpriteIconMorph.prototype.thumbSize = new Point(40, 40);
SpriteIconMorph.prototype.labelShadowOffset = null;
SpriteIconMorph.prototype.labelShadowColor = null;
SpriteIconMorph.prototype.labelColor = WHITE;
SpriteIconMorph.prototype.fontSize = 9;

// SpriteIconMorph instance creation:

function SpriteIconMorph(aSprite) {
    this.init(aSprite);
}

SpriteIconMorph.prototype.init = function (aSprite) {
    var colors, action, query, hover;

    colors = [
        IDE_Morph.prototype.groupColor,
        IDE_Morph.prototype.frameColor,
        IDE_Morph.prototype.frameColor
    ];

    action = () => {
        // make my sprite the current one
        var ide = this.parentThatIsA(IDE_Morph);

        if (ide) {
            ide.selectSprite(this.object);
        }
    };

    query = () => {
        // answer true if my sprite is the current one
        var ide = this.parentThatIsA(IDE_Morph);

        if (ide) {
            return ide.currentSprite === this.object;
        }
        return false;
    };

    hover = () => {
        if (!aSprite.exemplar) {return null; }
        return (localize('parent') + ':\n' + aSprite.exemplar.name);
    };

    // additional properties:
    this.object = aSprite || new SpriteMorph(); // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;
    this.rotationButton = null; // synchronous rotation of nested sprites

    // additional properties for highlighting
    this.isFlashing = false;
    this.previousColor = null;
    this.previousOutline = null;
    this.previousState = null;

    // initialize inherited properties:
    SpriteIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        hover // hint
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

SpriteIconMorph.prototype.createThumbnail = function () {
    if (this.thumbnail) {
        this.thumbnail.destroy();
    }

    this.thumbnail = new Morph();
    this.thumbnail.isCachingImage = true;
    this.thumbnail.bounds.setExtent(this.thumbSize);
    if (this.object instanceof SpriteMorph) { // support nested sprites
        this.thumbnail.cachedImage = this.object.fullThumbnail(
            this.thumbSize,
            this.thumbnail.cachedImage
        );
        this.add(this.thumbnail);
        this.createRotationButton();
    } else {
        this.thumbnail.cachedImage = this.object.thumbnail(
            this.thumbSize,
            this.thumbnail.cachedImage
        );
        this.add(this.thumbnail);
    }
};

SpriteIconMorph.prototype.createLabel = function () {
    var txt;

    if (this.label) {
        this.label.destroy();
    }
    txt = new StringMorph(
        this.object.name,
        this.fontSize,
        this.fontStyle,
        true,
        false,
        false,
        this.labelShadowOffset,
        this.labelShadowColor,
        this.labelColor
    );

    this.label = new FrameMorph();
    this.label.acceptsDrops = false;
    this.label.alpha = 0;
    this.label.setExtent(txt.extent());
    txt.setPosition(this.label.position());
    this.label.add(txt);
    this.add(this.label);
};

SpriteIconMorph.prototype.createRotationButton = function () {
    var button;

    if (this.rotationButton) {
        this.rotationButton.destroy();
        this.roationButton = null;
    }
    if (!this.object.anchor) {
        return;
    }

    button = new ToggleButtonMorph(
        null, // colors,
        null, // target
        () => this.object.rotatesWithAnchor = !this.object.rotatesWithAnchor,
        [
            '\u2192',
            '\u21BB'
        ],
        () => this.object.rotatesWithAnchor // query
    );

    button.corner = 8;
    button.labelMinExtent = new Point(11, 11);
    button.padding = 0;
    button.pressColor = button.color;
    // button.hint = 'rotate synchronously\nwith anchor';
    button.fixLayout();
    button.refresh();
    this.rotationButton = button;
    this.add(this.rotationButton);
};

// SpriteIconMorph stepping

SpriteIconMorph.prototype.step = function () {
    if (this.version !== this.object.version) {
        this.createThumbnail();
        this.createLabel();
        this.fixLayout();
        this.version = this.object.version;
        this.refresh();
    }
};

// SpriteIconMorph layout

SpriteIconMorph.prototype.fixLayout = function () {
    if (!this.thumbnail || !this.label) {return null; }

    this.bounds.setWidth(
        this.thumbnail.width()
            + this.outline * 2
            + this.edge * 2
            + this.padding * 2
    );

    this.bounds.setHeight(
        this.thumbnail.height()
            + this.outline * 2
            + this.edge * 2
            + this.padding * 3
            + this.label.height()
    );

    this.thumbnail.setCenter(this.center());
    this.thumbnail.setTop(
        this.top() + this.outline + this.edge + this.padding
    );

    if (this.rotationButton) {
        this.rotationButton.setTop(this.top());
        this.rotationButton.setRight(this.right());
    }

    this.label.setWidth(
        Math.min(
            this.label.children[0].width(), // the actual text
            this.thumbnail.width()
        )
    );
    this.label.setCenter(this.center());
    this.label.setTop(
        this.thumbnail.bottom() + this.padding
    );
};

// SpriteIconMorph menu

SpriteIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);

    if (this.object instanceof StageMorph) {
        menu.addItem(
            'pic...',
            () => {
                var ide = this.parentThatIsA(IDE_Morph);
                ide.saveCanvasAs(
                    this.object.fullImage(),
                    this.object.name
                );
            },
            'save a picture\nof the stage'
        );
        if (this.object.trailsLog.length) {
            menu.addLine();
            menu.addItem(
                'svg...',
                () => this.object.exportTrailsLogAsSVG(),
                'export pen trails\nline segments as SVG'
            );

            menu.addItem(
                'poly svg...',
                () => this.object.exportTrailsLogAsPolySVG(),
                'export pen trails\nline segments as polyline SVG'
            );
            menu.addItem(
                'dst...',
                () => this.object.exportTrailsLogAsDST(),
                'export pen trails\nas DST embroidery file'
            );
            menu.addItem(
                'exp...',
                () => this.object.exportTrailsLogAsEXP(),
                'export pen trails\nas EXP embroidery file'
            );

        }
        return menu;
    }
    if (!(this.object instanceof SpriteMorph)) {return null; }
    menu.addItem("show", 'showSpriteOnStage');
    menu.addLine();
    menu.addItem("duplicate", 'duplicateSprite');
    if (StageMorph.prototype.enableInheritance) {
        menu.addItem("clone", 'instantiateSprite');
    }
    menu.addItem("delete", 'removeSprite');
    menu.addLine();
    if (this.object.solution) {
        menu.addItem(
            'extract solution',
            () => {
                this.parentThatIsA(IDE_Morph).undelete(
                    this.object.solution.fullCopy(),
                    this.center()
                );
            }
        );
        menu.addItem(
            'delete solution',
            () => {
                this.parentThatIsA(IDE_Morph).removeSprite(
                    this.object.solution
                );
                this.object.solution = null;
                this.object.recordUserEdit(
                    'sprite',
                    'solution',
                    'delete'
                );
            }
        );
        menu.addLine();
    }
    if (StageMorph.prototype.enableInheritance) {
        /* version that hides refactoring capability unless shift-clicked
        if (this.world().currentKey === 16) { // shift-clicked
            menu.addItem(
                "parent...",
                'chooseExemplar',
                null,
                new Color(100, 0, 0)
            );
        }
        */
        menu.addItem("parent...", 'chooseExemplar');
        if (this.object.exemplar) {
            menu.addItem(
                "release",
                'releaseSprite',
                'make temporary and\nhide in the sprite corral'
            );
        }
    }
    if (this.object.anchor) {
        menu.addItem(
            localize('detach from') + ' ' + this.object.anchor.name,
            () => this.object.detachFromAnchor()
        );
    }
    if (this.object.parts.length) {
        menu.addItem(
            'detach all parts',
            () => this.object.detachAllParts()
        );
    }
    menu.addItem("export...", 'exportSprite');
    return menu;
};

SpriteIconMorph.prototype.duplicateSprite = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    if (ide) {
        ide.duplicateSprite(this.object);
    }
};

SpriteIconMorph.prototype.instantiateSprite = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    if (ide) {
        ide.instantiateSprite(this.object);
    }
};

SpriteIconMorph.prototype.removeSprite = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    if (ide) {
        ide.removeSprite(this.object);
    }
};

SpriteIconMorph.prototype.exportSprite = function () {
    this.object.exportSprite();
};

SpriteIconMorph.prototype.chooseExemplar = function () {
    this.object.chooseExemplar();
};

SpriteIconMorph.prototype.releaseSprite = function () {
    this.object.release();
    this.object.recordUserEdit(
        'sprite',
        'release',
        this.object.name
    );
};

SpriteIconMorph.prototype.showSpriteOnStage = function () {
    this.object.showOnStage();
};

// SpriteIconMorph events

SpriteIconMorph.prototype.mouseDoubleClick = function () {
	if (this.object instanceof SpriteMorph) {
    	this.object.flash();
    }
};

// SpriteIconMorph drawing

SpriteIconMorph.prototype.render = function (ctx) {
    // only draw the edges if I am selected
    switch (this.userState) {
    case 'highlight':
        this.drawBackground(ctx, this.highlightColor);
        break;
    case 'pressed':
        this.drawOutline(ctx);
        this.drawBackground(ctx, this.pressColor);
        this.drawEdges(
            ctx,
            this.pressColor,
            this.pressColor.lighter(40),
            this.pressColor.darker(40)
        );
        break;
    default:
        this.drawBackground(ctx, this.getRenderColor());
    }
};

SpriteIconMorph.prototype.getRenderColor =
    ScriptsMorph.prototype.getRenderColor;

// SpriteIconMorph drag & drop

SpriteIconMorph.prototype.prepareToBeGrabbed = function () {
    var ide = this.parentThatIsA(IDE_Morph),
        idx;
    this.mouseClickLeft(); // select me
    this.alpha = 0.85;
    if (ide) {
        idx = ide.sprites.asArray().indexOf(this.object);
        ide.sprites.remove(idx + 1);
        ide.createCorral(true); // keep scenes
        ide.fixLayout();
    }
};

SpriteIconMorph.prototype.justDropped = function () {
    this.alpha = 1;
};

SpriteIconMorph.prototype.wantsDropOf = function (morph) {
    // allow scripts & media to be copied from one sprite to another
    // by drag & drop
    return morph instanceof BlockMorph
        || (morph instanceof CommentMorph)
        || (morph instanceof CostumeIconMorph)
        || (morph instanceof SoundIconMorph);
};

SpriteIconMorph.prototype.reactToDropOf = function (morph, hand) {
    if (morph instanceof BlockMorph || morph instanceof CommentMorph) {
        if (!(morph instanceof HatBlockMorph &&
            morph.isCustomBlockSpecific())
        ) {
            this.copyStack(morph);
        }
    } else if (morph instanceof CostumeIconMorph) {
        this.copyCostume(morph.object);
    } else if (morph instanceof SoundIconMorph) {
        this.copySound(morph.object);
    }
    this.world().add(morph);
    morph.slideBackTo(hand.grabOrigin);
};

SpriteIconMorph.prototype.copyStack = function (block) {
    var sprite = this.object,
    	dup = block.fullCopy(),
        y = Math.max(
            sprite.scripts.children.map(stack =>
                stack.fullBounds().bottom()
            ).concat([sprite.scripts.top()])
        );

    dup.setPosition(new Point(sprite.scripts.left() + 20, y + 20));
    sprite.scripts.add(dup);
    if (dup instanceof BlockMorph) {
        dup.allComments().forEach(comment => comment.align(dup));
    }
    sprite.scripts.adjustBounds();

    // delete all local custom blocks (methods) that the receiver
    // doesn't understand
    dup.allChildren().forEach(morph => {
	    if (morph.isCustomBlock &&
            !morph.isGlobal &&
        		!sprite.getMethod(morph.blockSpec)
        ) {
            morph.deleteBlock();
        }
    });
};

SpriteIconMorph.prototype.copyCostume = function (costume) {
    var dup = costume.copy();
    dup.name = this.object.newCostumeName(dup.name);
    this.object.addCostume(dup);
    this.object.wearCostume(dup);
};

SpriteIconMorph.prototype.copySound = function (sound) {
    var dup = sound.copy();
    this.object.addSound(dup.audio, dup.name);
};

// SpriteIconMorph flashing

SpriteIconMorph.prototype.flash = function () {
    var world = this.world();

    if (this.isFlashing) {return; }
    this.flashOn();

    world.animations.push(new Animation(
        nop,
        nop,
        0,
        800,
        nop,
        () => this.flashOff()
    ));
};

SpriteIconMorph.prototype.flashOn = function () {
    var isFlat = MorphicPreferences.isFlat,
        highlight = SpriteMorph.prototype.highlightColor;

    if (this.isFlashing) {return; }

    this.previousColor = isFlat ? this.pressColor : this.outlineColor;
    this.previousOutline = this.outline;
    this.previousState = this.userState;

    if (isFlat) {
        this.pressColor = highlight;
    } else {
        this.outlineColor = highlight;
        this.outline = 2;
    }
    this.userState = 'pressed';
    this.rerender();
    this.isFlashing = true;
};

SpriteIconMorph.prototype.flashOff = function () {
    if (!this.isFlashing) {return; }

    if (MorphicPreferences.isFlat) {
        this.pressColor = this.previousColor;
    } else {
        this.outlineColor = this.previousColor;
        this.outline = this.previousOutline;
    }
    this.userState = this.previousState;
    this.rerender();
    this.isFlashing = false;
};

// CostumeIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the SpriteEditor's "Costumes" tab, keeping
    a self-updating thumbnail of the costume I'm respresenting, and a
    self-updating label of the costume's name (in case it is changed
    elsewhere)
*/

// CostumeIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

CostumeIconMorph.prototype = new ToggleButtonMorph();
CostumeIconMorph.prototype.constructor = CostumeIconMorph;
CostumeIconMorph.uber = ToggleButtonMorph.prototype;

// CostumeIconMorph settings

CostumeIconMorph.prototype.thumbSize = new Point(80, 60);
CostumeIconMorph.prototype.labelShadowOffset = null;
CostumeIconMorph.prototype.labelShadowColor = null;
CostumeIconMorph.prototype.labelColor = WHITE;
CostumeIconMorph.prototype.fontSize = 9;

// CostumeIconMorph instance creation:

function CostumeIconMorph(aCostume) {
    this.init(aCostume);
}

CostumeIconMorph.prototype.init = function (aCostume) {
    var colors, action, query;

    colors = [
        IDE_Morph.prototype.groupColor,
        IDE_Morph.prototype.frameColor,
        IDE_Morph.prototype.frameColor
    ];

    action = () => {
        // make my costume the current one
        var ide = this.parentThatIsA(IDE_Morph),
            wardrobe = this.parentThatIsA(WardrobeMorph);

        if (ide) {
            ide.currentSprite.wearCostume(this.object);
        }
        if (wardrobe) {
            wardrobe.updateSelection();
        }
    };

    query = () => {
        // answer true if my costume is the current one
        var ide = this.parentThatIsA(IDE_Morph);

        if (ide) {
            return ide.currentSprite.costume === this.object;
        }
        return false;
    };

    // additional properties:
    this.object = aCostume || new Costume(); // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;

    // initialize inherited properties:
    CostumeIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        null // hint
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

CostumeIconMorph.prototype.createThumbnail = function () {
    var watermark, txt;
    SpriteIconMorph.prototype.createThumbnail.call(this);
    watermark = this.object instanceof SVG_Costume ? 'svg'
        : (this.object.embeddedData ? (
                this.typeOfStringData(this.object.embeddedData) === 'data' ?
                    'dta' : '</>'
        )
            : null);
    if (watermark) {
        txt = new StringMorph(
            watermark,
            this.fontSize * 0.8,
            this.fontStyle,
            false,
            false,
            false,
            this.labelShadowOffset,
            this.labelShadowColor,
            this.labelColor
        );
        txt.setBottom(this.thumbnail.bottom());
        this.thumbnail.add(txt);
    }
};

CostumeIconMorph.prototype.createLabel
    = SpriteIconMorph.prototype.createLabel;

// CostumeIconMorph stepping

CostumeIconMorph.prototype.step
    = SpriteIconMorph.prototype.step;

// CostumeIconMorph layout

CostumeIconMorph.prototype.fixLayout
    = SpriteIconMorph.prototype.fixLayout;

// CostumeIconMorph menu

CostumeIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    if (!(this.object instanceof Costume)) {return null; }
    menu.addItem("edit", "editCostume");
    if (this.world().currentKey === 16) { // shift clicked
        menu.addItem(
            'edit rotation point only...',
            'editRotationPointOnly',
            null,
            new Color(100, 0, 0)
        );
    }
    menu.addItem("rename", "renameCostume");
    menu.addLine();
    menu.addItem("duplicate", "duplicateCostume");
    menu.addItem("delete", "removeCostume");
    menu.addLine();
    if (this.object.embeddedData) {
        menu.addItem(
            "get" + ' ' + this.typeOfStringData(this.object.embeddedData),
            "importEmbeddedData"
        );
    }
    menu.addItem("export", "exportCostume");
    return menu;
};

CostumeIconMorph.prototype.editCostume = function () {
    this.disinherit();

    if (this.object instanceof SVG_Costume && this.object.shapes.length === 0) {
        try {
            this.object.parseShapes();
        } catch (e) {
            this.editRotationPointOnly();
            return;
        }
    }

    this.object.edit(
        this.world(),
        this.parentThatIsA(IDE_Morph),
        false // not a new costume, retain existing rotation center
    );
};

CostumeIconMorph.prototype.editRotationPointOnly = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    this.object.editRotationPointOnly(this.world(), ide);
    ide.hasChangedMedia = true;
    ide.currentSprite.recordUserEdit(
        'costume',
        'rotation point',
        this.object.name
    );
};

CostumeIconMorph.prototype.renameCostume = function () {
    this.disinherit();
    var costume = this.object,
        wardrobe = this.parentThatIsA(WardrobeMorph),
        ide = this.parentThatIsA(IDE_Morph);
    new DialogBoxMorph(
        null,
        answer => {
            var old = costume.name;
            if (answer && (answer !== costume.name)) {
                costume.name = wardrobe.sprite.newCostumeName(
                    answer,
                    costume
                );
                costume.version = Date.now();
                ide.hasChangedMedia = true;
                wardrobe.sprite.recordUserEdit(
                    'costume',
                    'rename',
                    old,
                    costume.name
                );
            }
        }
    ).prompt(
        wardrobe.sprite instanceof SpriteMorph ?
            'rename costume' : 'rename background',
        costume.name,
        this.world()
    );
};

CostumeIconMorph.prototype.duplicateCostume = function () {
    var wardrobe = this.parentThatIsA(WardrobeMorph),
        ide = this.parentThatIsA(IDE_Morph),
        newcos = this.object.copy();
    newcos.name = wardrobe.sprite.newCostumeName(newcos.name);
    wardrobe.sprite.addCostume(newcos);
    wardrobe.updateList();
    if (ide) {
        ide.currentSprite.wearCostume(newcos);
    }
};

CostumeIconMorph.prototype.removeCostume = function () {
    var wardrobe = this.parentThatIsA(WardrobeMorph),
        idx = this.parent.children.indexOf(this),
        off = CamSnapshotDialogMorph.prototype.enableCamera ? 3 : 2;
    wardrobe.removeCostumeAt(idx - off); // ignore paintbrush and camera buttons
    if (wardrobe.sprite.costume === this.object) {
        wardrobe.sprite.wearCostume(null);
    }
    wardrobe.sprite.recordUserEdit(
        'costume',
        'delete',
        idx - off,
        this.object.name
    );
};

CostumeIconMorph.prototype.importEmbeddedData = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    ide.spriteBar.tabBar.tabTo('scripts');
    ide.droppedText(this.object.embeddedData, this.object.name, '');
};

CostumeIconMorph.prototype.typeOfStringData = function (aString) {
    // check for Snap specific files, projects, libraries, sprites, scripts
    if (aString[0] === '<') {
        if ([
                'project',
                'snapdata',
                'blocks',
                'sprites',
                'block',
                'script'
            ].some(tag => aString.slice(1).startsWith(tag))
        ) {
            return 'blocks';
        }
    }
    return 'data';
};

CostumeIconMorph.prototype.exportCostume = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    if (this.object instanceof SVG_Costume) {
        // don't show SVG costumes in a new tab (shows text)
        ide.saveFileAs(this.object.contents.src, 'text/svg', this.object.name);
    } else if (this.object.embeddedData) {
        // embed payload data (e.g blocks)  inside the PNG image data
        ide.saveFileAs(this.object.pngData(), 'image/png', this.object.name);
    } else { // rasterized Costume
        ide.saveCanvasAs(this.object.contents, this.object.name);
    }
};

// CostumeIconMorph drawing

CostumeIconMorph.prototype.render
    = SpriteIconMorph.prototype.render;

// CostumeIconMorph inheritance

CostumeIconMorph.prototype.disinherit = function () {
    var wardrobe = this.parentThatIsA(WardrobeMorph),
        idx = this.parent.children.indexOf(this);
    if (wardrobe.sprite.inheritsAttribute('costumes')) {
        wardrobe.sprite.shadowAttribute('costumes');
        this.object = wardrobe.sprite.costumes.at(idx - 3);
    }
};

// CostumeIconMorph drag & drop

CostumeIconMorph.prototype.prepareToBeGrabbed = function () {
    this.disinherit();
    this.mouseClickLeft(); // select me
    this.removeCostume();
};

// TurtleIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the SpriteEditor's "Costumes" tab, keeping
    a thumbnail of the sprite's or stage's default "Turtle" costume.
*/

// TurtleIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

TurtleIconMorph.prototype = new ToggleButtonMorph();
TurtleIconMorph.prototype.constructor = TurtleIconMorph;
TurtleIconMorph.uber = ToggleButtonMorph.prototype;

// TurtleIconMorph settings

TurtleIconMorph.prototype.thumbSize = new Point(80, 60);
TurtleIconMorph.prototype.labelShadowOffset = null;
TurtleIconMorph.prototype.labelShadowColor = null;
TurtleIconMorph.prototype.labelColor = WHITE;
TurtleIconMorph.prototype.fontSize = 9;

// TurtleIconMorph instance creation:

function TurtleIconMorph(aSpriteOrStage) {
    this.init(aSpriteOrStage);
}

TurtleIconMorph.prototype.init = function (aSpriteOrStage) {
    var colors, action, query;

    colors = [
        IDE_Morph.prototype.groupColor,
        IDE_Morph.prototype.frameColor,
        IDE_Morph.prototype.frameColor
    ];

    action = () => {
        // make my costume the current one
        var ide = this.parentThatIsA(IDE_Morph),
            wardrobe = this.parentThatIsA(WardrobeMorph);

        if (ide) {
            ide.currentSprite.wearCostume(null);
        }
        if (wardrobe) {
            wardrobe.updateSelection();
        }
    };

    query = () => {
        // answer true if my costume is the current one
        var ide = this.parentThatIsA(IDE_Morph);

        if (ide) {
            return ide.currentSprite.costume === null;
        }
        return false;
    };

    // additional properties:
    this.object = aSpriteOrStage; // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;

    // initialize inherited properties:
    TurtleIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        'default', // label string
        query, // predicate/selector
        null, // environment
        null // hint
    );

    // override defaults and build additional components
    this.isDraggable = false;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
};

TurtleIconMorph.prototype.createThumbnail = function () {
    var isFlat = MorphicPreferences.isFlat;

    if (this.thumbnail) {
        this.thumbnail.destroy();
    }
    if (this.object instanceof SpriteMorph) {
        this.thumbnail = new SymbolMorph(
            'turtle',
            this.thumbSize.y,
            this.labelColor,
            isFlat ? null : new Point(-1, -1),
            new Color(0, 0, 0)
        );
    } else {
        this.thumbnail = new SymbolMorph(
            'stage',
            this.thumbSize.y,
            this.labelColor,
            isFlat ? null : new Point(-1, -1),
            new Color(0, 0, 0)
        );
    }
    this.add(this.thumbnail);
};

TurtleIconMorph.prototype.createLabel = function () {
    var txt;

    if (this.label) {
        this.label.destroy();
    }
    txt = new StringMorph(
        localize(
            this.object instanceof SpriteMorph ? 'Turtle' : 'Empty'
        ),
        this.fontSize,
        this.fontStyle,
        true,
        false,
        false,
        this.labelShadowOffset,
        this.labelShadowColor,
        this.labelColor
    );

    this.label = new FrameMorph();
    this.label.acceptsDrops = false;
    this.label.alpha = 0;
    this.label.setExtent(txt.extent());
    txt.setPosition(this.label.position());
    this.label.add(txt);
    this.add(this.label);
};

// TurtleIconMorph layout

TurtleIconMorph.prototype.fixLayout
    = SpriteIconMorph.prototype.fixLayout;

// TurtleIconMorph drawing

TurtleIconMorph.prototype.render
    = SpriteIconMorph.prototype.render;

// TurtleIconMorph user menu

TurtleIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this, 'pen'),
        on = '\u25CF',
        off = '\u25CB';
    if (this.object instanceof StageMorph) {
        return null;
    }
    menu.addItem(
        (this.object.penPoint === 'tip' ? on : off) + ' ' + localize('tip'),
        () => {
            this.object.penPoint = 'tip';
            this.object.changed();
            this.object.fixLayout();
            this.object.rerender();
        }
    );
    menu.addItem(
        (this.object.penPoint === 'middle' ? on : off) + ' ' + localize(
            'middle'
        ),
        () => {
            this.object.penPoint = 'middle';
            this.object.changed();
            this.object.fixLayout();
            this.object.rerender();
        }
    );
    return menu;
};

// WardrobeMorph ///////////////////////////////////////////////////////

// I am a watcher on a sprite's costume list

// WardrobeMorph inherits from ScrollFrameMorph

WardrobeMorph.prototype = new ScrollFrameMorph();
WardrobeMorph.prototype.constructor = WardrobeMorph;
WardrobeMorph.uber = ScrollFrameMorph.prototype;

// WardrobeMorph settings

// ... to follow ...

// WardrobeMorph instance creation:

function WardrobeMorph(aSprite, sliderColor) {
    this.init(aSprite, sliderColor);
}

WardrobeMorph.prototype.init = function (aSprite, sliderColor) {
    // additional properties
    this.sprite = aSprite || new SpriteMorph();
    this.costumesVersion = null;
    this.spriteVersion = null;

    // initialize inherited properties
    WardrobeMorph.uber.init.call(this, null, null, sliderColor);

    // configure inherited properties
    // this.fps = 2; // commented out to make scrollbars more responsive
    this.updateList();
};

// Wardrobe updating

WardrobeMorph.prototype.updateList = function () {
    var x = this.left() + 5,
        y = this.top() + 5,
        padding = 4,
        toolsPadding = 5,
        oldPos = this.contents.position(),
        icon,
        txt,
        paintbutton,
        cambutton;

    this.changed();

    this.contents.destroy();
    this.contents = new FrameMorph(this);
    this.contents.acceptsDrops = false;
    this.contents.reactToDropOf = (icon) => {
        this.reactToDropOf(icon);
    };
    this.addBack(this.contents);

    icon = new TurtleIconMorph(this.sprite);
    icon.setPosition(new Point(x, y));
    this.addContents(icon);
    y = icon.bottom() + padding;

    paintbutton = new PushButtonMorph(
        this,
        "paintNew",
        new SymbolMorph("brush", 15)
    );
    paintbutton.padding = 0;
    paintbutton.corner = 12;
    paintbutton.color = IDE_Morph.prototype.groupColor;
    paintbutton.highlightColor = IDE_Morph.prototype.frameColor.darker(50);
    paintbutton.pressColor = paintbutton.highlightColor;
    paintbutton.labelMinExtent = new Point(36, 18);
    paintbutton.labelShadowOffset = new Point(-1, -1);
    paintbutton.labelShadowColor = paintbutton.highlightColor;
    paintbutton.labelColor = TurtleIconMorph.prototype.labelColor;
    paintbutton.contrast = this.buttonContrast;
    paintbutton.hint = "Paint a new costume";
    paintbutton.setPosition(new Point(x, y));
    paintbutton.fixLayout();
    paintbutton.setCenter(icon.center());
    paintbutton.setLeft(icon.right() + padding * 4);

    this.addContents(paintbutton);

    if (CamSnapshotDialogMorph.prototype.enableCamera) {
        cambutton = new PushButtonMorph(
            this,
            "newFromCam",
            new SymbolMorph("camera", 15)
        );
        cambutton.padding = 0;
        cambutton.corner = 12;
        cambutton.color = IDE_Morph.prototype.groupColor;
        cambutton.highlightColor = IDE_Morph.prototype.frameColor.darker(50);
        cambutton.pressColor = paintbutton.highlightColor;
        cambutton.labelMinExtent = new Point(36, 18);
        cambutton.labelShadowOffset = new Point(-1, -1);
        cambutton.labelShadowColor = paintbutton.highlightColor;
        cambutton.labelColor = TurtleIconMorph.prototype.labelColor;
        cambutton.contrast = this.buttonContrast;
        cambutton.hint = "Import a new costume from your webcam";
        cambutton.setPosition(new Point(x, y));
        cambutton.fixLayout();
        cambutton.setCenter(paintbutton.center());
        cambutton.setLeft(paintbutton.right() + toolsPadding);

        this.addContents(cambutton);

        if (!CamSnapshotDialogMorph.prototype.enabled) {
            cambutton.disable();
            cambutton.hint =
            	CamSnapshotDialogMorph.prototype.notSupportedMessage;
        }

        document.addEventListener(
            'cameraDisabled',
            () => {
                cambutton.disable();
                cambutton.hint =
                    CamSnapshotDialogMorph.prototype.notSupportedMessage;
            }
        );
    }

    txt = new TextMorph(localize(
        "costumes tab help" // look up long string in translator
    ));
    txt.fontSize = 9;
    txt.setColor(SpriteMorph.prototype.paletteTextColor);

    txt.setPosition(new Point(x, y));
    this.addContents(txt);
    y = txt.bottom() + padding;

    this.sprite.costumes.asArray().forEach(costume => {
        icon = new CostumeIconMorph(costume);
        icon.setPosition(new Point(x, y));
        this.addContents(icon);
        y = icon.bottom() + padding;
    });
    this.costumesVersion = this.sprite.costumes.lastChanged;

    this.contents.setPosition(oldPos);
    this.adjustScrollBars();
    this.changed();

    this.updateSelection();
};

WardrobeMorph.prototype.updateSelection = function () {
    this.contents.children.forEach(function (morph) {
        if (morph.refresh) {
            morph.refresh();
        }
    });
    this.spriteVersion = this.sprite.version;
};

// Wardrobe stepping

WardrobeMorph.prototype.step = function () {
    if (this.costumesVersion !== this.sprite.costumes.lastChanged) {
        this.updateList();
    }
    if (this.spriteVersion !== this.sprite.version) {
        this.updateSelection();
    }
};

// Wardrobe ops

WardrobeMorph.prototype.removeCostumeAt = function (idx) {
    this.sprite.shadowAttribute('costumes');
    this.sprite.costumes.remove(idx);
    this.updateList();
};

WardrobeMorph.prototype.paintNew = function () {
    var ide = this.parentThatIsA(IDE_Morph),
        cos = new Costume(
            newCanvas(null, true),
            this.sprite.newCostumeName(localize('Untitled')),
            null, // rotation center
            null, // don't shrink-to-fit
            ide.stage.dimensions // max extent
        );

    cos.edit(
        this.world(),
        ide,
        true,
        null,
        () => {
            this.sprite.shadowAttribute('costumes');
            this.sprite.addCostume(cos);
            this.updateList();
            this.sprite.wearCostume(cos);
            this.sprite.recordUserEdit(
                'costume',
                'draw',
                cos.name
            );
        }
    );
};

WardrobeMorph.prototype.newFromCam = function () {
    var camDialog,
        ide = this.parentThatIsA(IDE_Morph),
        sprite = this.sprite;

    camDialog = new CamSnapshotDialogMorph(
        ide,
        sprite,
        nop,
        costume => {
            sprite.addCostume(costume);
            sprite.wearCostume(costume);
            this.updateList();
            sprite.recordUserEdit(
                'costume',
                'snap',
                costume.name
            );
        });

    camDialog.key = 'camera';
    camDialog.popUp(this.world());
};

// Wardrobe drag & drop

WardrobeMorph.prototype.wantsDropOf = function (morph) {
    return morph instanceof CostumeIconMorph;
};

WardrobeMorph.prototype.reactToDropOf = function (icon) {
    var idx = 0,
        costume = icon.object,
        top = icon.top();
    icon.destroy();
    this.contents.children.forEach(item => {
        if (item instanceof CostumeIconMorph && item.top() < top - 4) {
            idx += 1;
        }
    });
    this.sprite.shadowAttribute('costumes');
    this.sprite.costumes.add(costume, idx + 1);
    this.updateList();
    icon.mouseClickLeft(); // select
    this.sprite.recordUserEdit(
        'costume',
        'add',
        costume.name,
        idx + 1
    );
};

// SoundIconMorph ///////////////////////////////////////////////////////

/*
    I am an element in the SpriteEditor's "Sounds" tab.
*/

// SoundIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

SoundIconMorph.prototype = new ToggleButtonMorph();
SoundIconMorph.prototype.constructor = SoundIconMorph;
SoundIconMorph.uber = ToggleButtonMorph.prototype;

// SoundIconMorph settings

SoundIconMorph.prototype.thumbSize = new Point(80, 60);
SoundIconMorph.prototype.labelShadowOffset = null;
SoundIconMorph.prototype.labelShadowColor = null;
SoundIconMorph.prototype.labelColor = WHITE;
SoundIconMorph.prototype.fontSize = 9;

// SoundIconMorph instance creation:

function SoundIconMorph(aSound) {
    this.init(aSound);
}

SoundIconMorph.prototype.init = function (aSound) {
    var colors, action, query;

    colors = [
        IDE_Morph.prototype.groupColor,
        IDE_Morph.prototype.frameColor,
        IDE_Morph.prototype.frameColor
    ];

    action = nop; // When I am selected (which is never the case for sounds)

    query = () => false;

    // additional properties:
    this.object = aSound; // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;

    // initialize inherited properties:
    SoundIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        null // hint
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

SoundIconMorph.prototype.createThumbnail = function () {
    var label;
    if (this.thumbnail) {
        this.thumbnail.destroy();
    }
    this.thumbnail = new Morph();
    this.thumbnail.bounds.setExtent(this.thumbSize);
    this.add(this.thumbnail);
    label = new StringMorph(
        this.createInfo(),
        '16',
        '',
        true,
        false,
        false,
        this.labelShadowOffset,
        this.labelShadowColor,
        new Color(200, 200, 200)
    );
    this.thumbnail.add(label);
    label.setCenter(new Point(40, 15));

    this.button = new PushButtonMorph(
        this,
        'toggleAudioPlaying',
        (this.object.previewAudio ? 'Stop' : 'Play')
    );
    this.button.hint = 'Play sound';
    this.button.fixLayout();
    this.thumbnail.add(this.button);
    this.button.setCenter(new Point(40, 40));
};

SoundIconMorph.prototype.createInfo = function () {
    var dur = Math.round(this.object.audio.duration || 0),
        mod = dur % 60;
    return Math.floor(dur / 60).toString()
            + ":"
            + (mod < 10 ? "0" : "")
            + mod.toString();
};

SoundIconMorph.prototype.toggleAudioPlaying = function () {
    if (!this.object.previewAudio) {
        //Audio is not playing
        this.button.labelString = 'Stop';
        this.button.hint = 'Stop sound';
        this.object.previewAudio = this.object.play();
        this.object.previewAudio.addEventListener(
            'ended',
            () => this.audioHasEnded(),
            false
        );
    } else {
        //Audio is currently playing
        this.button.labelString = 'Play';
        this.button.hint = 'Play sound';
        this.object.previewAudio.pause();
        this.object.previewAudio.terminated = true;
        this.object.previewAudio = null;
    }
    this.button.createLabel();
};

SoundIconMorph.prototype.audioHasEnded = function () {
    this.button.trigger();
    this.button.mouseLeave();
};

SoundIconMorph.prototype.createLabel
    = SpriteIconMorph.prototype.createLabel;

// SoundIconMorph stepping

/*
SoundIconMorph.prototype.step
    = SpriteIconMorph.prototype.step;
*/

// SoundIconMorph layout

SoundIconMorph.prototype.fixLayout
    = SpriteIconMorph.prototype.fixLayout;

// SoundIconMorph menu

SoundIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    if (!(this.object instanceof Sound)) { return null; }
    menu.addItem('rename', 'renameSound');
    menu.addItem('delete', 'removeSound');
    menu.addLine();
    menu.addItem('export', 'exportSound');
    return menu;
};


SoundIconMorph.prototype.renameSound = function () {
    var sound = this.object,
        ide = this.parentThatIsA(IDE_Morph);
    this.disinherit();
    new DialogBoxMorph(
        null,
        answer => {
            var old = sound.name;
            if (answer && (answer !== old)) {
                sound.name = answer;
                sound.version = Date.now();
                this.createLabel(); // can be omitted once I'm stepping
                this.fixLayout(); // can be omitted once I'm stepping
                ide.hasChangedMedia = true;
                ide.currentSprite.recordUserEdit(
                    'sound',
                    'rename',
                    old,
                    sound.name
                );

            }
        }
    ).prompt(
        'rename sound',
        sound.name,
        this.world()
    );
};

SoundIconMorph.prototype.removeSound = function () {
    var jukebox = this.parentThatIsA(JukeboxMorph),
        idx = this.parent.children.indexOf(this) - 1;
    jukebox.removeSound(idx);
    jukebox.sprite.recordUserEdit(
        'sound',
        'delete',
        idx,
        this.object.name
    );
};

SoundIconMorph.prototype.exportSound = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    ide.saveAudioAs(this.object.audio, this.object.name);
};

SoundIconMorph.prototype.render
    = SpriteIconMorph.prototype.render;

SoundIconMorph.prototype.createLabel
    = SpriteIconMorph.prototype.createLabel;

// SoundIconMorph inheritance

SoundIconMorph.prototype.disinherit = function () {
    var jukebox = this.parentThatIsA(JukeboxMorph),
        idx = this.parent.children.indexOf(this);
    if (jukebox.sprite.inheritsAttribute('sounds')) {
        jukebox.sprite.shadowAttribute('sounds');
        this.object = jukebox.sprite.sounds.at(idx - 1);
    }
};

// SoundIconMorph drag & drop

SoundIconMorph.prototype.prepareToBeGrabbed = function () {
    this.disinherit();
    this.userState = 'pressed';
    this.state = true;
    this.rerender();
    this.removeSound();
};

// JukeboxMorph /////////////////////////////////////////////////////

/*
    I am JukeboxMorph, like WardrobeMorph, but for sounds
*/

// JukeboxMorph instance creation

JukeboxMorph.prototype = new ScrollFrameMorph();
JukeboxMorph.prototype.constructor = JukeboxMorph;
JukeboxMorph.uber = ScrollFrameMorph.prototype;

function JukeboxMorph(aSprite, sliderColor) {
    this.init(aSprite, sliderColor);
}

JukeboxMorph.prototype.init = function (aSprite, sliderColor) {
    // additional properties
    this.sprite = aSprite || new SpriteMorph();
    this.soundsVersion = null;
    this.spriteVersion = null;

    // initialize inherited properties
    JukeboxMorph.uber.init.call(this, null, null, sliderColor);

    // configure inherited properties
    this.acceptsDrops = false;
    // this.fps = 2; // commented out to make scrollbars more responsive
    this.updateList();
};

// Jukebox updating

JukeboxMorph.prototype.updateList = function () {
    var x = this.left() + 5,
        y = this.top() + 5,
        padding = 4,
        icon,
        txt,
        ide = this.sprite.parentThatIsA(IDE_Morph),
        recordButton;

    this.changed();

    this.contents.destroy();
    this.contents = new FrameMorph(this);
    this.contents.acceptsDrops = false;
    this.contents.reactToDropOf = (icon) => this.reactToDropOf(icon);
    this.addBack(this.contents);

    txt = new TextMorph(localize(
        'import a sound from your computer\nby dragging it into here'
    ));
    txt.fontSize = 9;
    txt.setColor(SpriteMorph.prototype.paletteTextColor);
    txt.setPosition(new Point(x, y));
    this.addContents(txt);

    recordButton = new PushButtonMorph(
        ide,
        'recordNewSound',
        new SymbolMorph('circleSolid', 15)
    );
    recordButton.padding = 0;
    recordButton.corner = 12;
    recordButton.color = IDE_Morph.prototype.groupColor;
    recordButton.highlightColor = IDE_Morph.prototype.frameColor.darker(50);
    recordButton.pressColor = recordButton.highlightColor;
    recordButton.labelMinExtent = new Point(36, 18);
    recordButton.labelShadowOffset = new Point(-1, -1);
    recordButton.labelShadowColor = recordButton.highlightColor;
    recordButton.labelColor = TurtleIconMorph.prototype.labelColor;
    recordButton.contrast = this.buttonContrast;
    recordButton.hint = 'Record a new sound';
    recordButton.fixLayout();
    recordButton.label.setColor(new Color(255, 20, 20));
    recordButton.setPosition(txt.bottomLeft().add(new Point(0, padding * 2)));

    this.addContents(recordButton);

    y = recordButton.bottom() + padding;

    this.sprite.sounds.asArray().forEach(sound => {
        icon = new SoundIconMorph(sound);
        icon.setPosition(new Point(x, y));
        this.addContents(icon);
        y = icon.bottom() + padding;
    });
    this.soundsVersion = this.sprite.sounds.lastChanged;

    this.changed();
    this.updateSelection();
};

JukeboxMorph.prototype.updateSelection = function () {
    this.contents.children.forEach(morph => {
        if (morph.refresh) {
            morph.refresh();
        }
    });
    this.spriteVersion = this.sprite.version;
};

// Jukebox stepping

JukeboxMorph.prototype.step = function () {
    if (this.soundsVersion !== this.sprite.sounds.lastChanged) {
        this.updateList();
    }
    if (this.spriteVersion !== this.sprite.version) {
        this.updateSelection();
    }
};

// Jukebox ops

JukeboxMorph.prototype.removeSound = function (idx) {
    this.sprite.sounds.remove(idx);
    this.updateList();
};

// Jukebox drag & drop

JukeboxMorph.prototype.wantsDropOf = function (morph) {
    return morph instanceof SoundIconMorph;
};

JukeboxMorph.prototype.reactToDropOf = function (icon) {
    var idx = 0,
        sound = icon.object,
        top = icon.top();

    icon.destroy();
    this.contents.children.forEach(item => {
        if (item instanceof SoundIconMorph && item.top() < top - 4) {
            idx += 1;
        }
    });

    this.sprite.shadowAttribute('sounds');
    this.sprite.sounds.add(sound, idx + 1);
    this.updateList();

    this.sprite.recordUserEdit(
        'sound',
        'add',
        sound.name,
        idx + 1
    );
};

// SceneIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in a SceneAlbum, keeping
    a self-updating thumbnail of the scene I'm respresenting, and a
    self-updating label of the scene's name (in case it is changed
    elsewhere)
*/

// SceneIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

SceneIconMorph.prototype = new ToggleButtonMorph();
SceneIconMorph.prototype.constructor = SceneIconMorph;
SceneIconMorph.uber = ToggleButtonMorph.prototype;

// SceneIconMorph settings

SceneIconMorph.prototype.thumbSize = new Point(40, 30);
SceneIconMorph.prototype.labelShadowOffset = null;
SceneIconMorph.prototype.labelShadowColor = null;
SceneIconMorph.prototype.labelColor = WHITE;
SceneIconMorph.prototype.fontSize = 9;

// SceneIconMorph instance creation:

function SceneIconMorph(aScene) {
    this.init(aScene);
}

SceneIconMorph.prototype.init = function (aScene) {
    var colors, action, query;

    colors = [
        IDE_Morph.prototype.frameColor,
        IDE_Morph.prototype.groupColor,
        IDE_Morph.prototype.groupColor
    ];

    action = () => {
        // make my scene the current one
        var ide = this.parentThatIsA(IDE_Morph),
            album = this.parentThatIsA(SceneAlbumMorph);
        album.scene = this.object;
        ide.switchToScene(this.object);
    };

    query = () => {
        // answer true if my scene is the current one
        var album = this.parentThatIsA(SceneAlbumMorph);
        if (album) {
            return album.scene === this.object;
        }
        return false;
    };

    // additional properties:
    this.object = aScene || new Scene(); // mandatory, actually
    this.version = this.object.stage.version;
    this.thumbnail = null;

    // initialize inherited properties:
    SceneIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name || localize('untitled'), // label string
        query, // predicate/selector
        null, // environment
        null // hint
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

SceneIconMorph.prototype.createThumbnail = function () {
    if (this.thumbnail) {
        this.thumbnail.destroy();
    }

    this.thumbnail = new Morph();
    this.thumbnail.isCachingImage = true;
    this.thumbnail.bounds.setExtent(this.thumbSize);
    this.thumbnail.cachedImage = this.object.stage.thumbnail(
        this.thumbSize,
        this.thumbnail.cachedImage
    );
    this.add(this.thumbnail);
};

SceneIconMorph.prototype.createLabel = function () {
    var txt;

    if (this.label) {
        this.label.destroy();
    }
    txt = new StringMorph(
        this.object.name || localize('untitled'),
        this.fontSize,
        this.fontStyle,
        false, // true
        false,
        false,
        this.labelShadowOffset,
        this.labelShadowColor,
        this.labelColor
    );

    this.label = new FrameMorph();
    this.label.acceptsDrops = false;
    this.label.alpha = 0;
    this.label.setExtent(txt.extent());
    txt.setPosition(this.label.position());
    this.label.add(txt);
    this.add(this.label);
};

// SceneIconMorph stepping

SceneIconMorph.prototype.step = function () {
    if (this.version !== this.object.stage.version) {
        this.createThumbnail();
        this.createLabel();
        this.fixLayout();
        this.version = this.object.stage.version;
        this.refresh();
    }
};

// SceneIconMorph layout

SceneIconMorph.prototype.fixLayout
    = SpriteIconMorph.prototype.fixLayout;

// SceneIconMorph menu

SceneIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    if (!(this.object instanceof Scene)) {
        return null;
    }
    if (!this.isProjectScene()) {
        menu.addItem("rename", "renameScene");
        menu.addItem("delete", "removeScene");
    }
    menu.addItem("export", "exportScene");
    return menu;
};

SceneIconMorph.prototype.renameScene = function () {
    var scene = this.object,
        ide = this.parentThatIsA(IDE_Morph);
    new DialogBoxMorph(
        null,
        answer => {
            if (answer && (answer !== scene.name)) {
                scene.name = ide.newSceneName(
                    answer,
                    scene
                );
                scene.stage.version = Date.now();
                if (scene === ide.scene) {
                    ide.controlBar.updateLabel();
                }
                ide.recordUnsavedChanges();
            }
        }
    ).prompt(
        'rename scene',
        scene.name,
        this.world()
    );
};

SceneIconMorph.prototype.removeScene = function () {
    var album = this.parentThatIsA(SceneAlbumMorph),
        idx = this.parent.children.indexOf(this) + 1,
        off = 0, // 2,
        ide = this.parentThatIsA(IDE_Morph);
    album.removeSceneAt(idx - off); // ignore buttons
    if (ide.scene === this.object) {
        ide.switchToScene(ide.scenes.at(1));
    }
};

SceneIconMorph.prototype.exportScene = function () {
    // Export scene as project XML, saving a file to disk
    var menu, str,
        ide = this.parentThatIsA(IDE_Morph),
        name = this.object.name || localize('untitled');

    try {
        menu = ide.showMessage('Exporting');
        str = ide.serializer.serialize(
            new Project(new List([this.object]), this.object)
        );
        ide.saveXMLAs(str, name);
        menu.destroy();
        ide.showMessage('Exported!', 1);
    } catch (err) {
        if (Process.prototype.isCatchingErrors) {
            ide.showMessage('Export failed: ' + err);
        } else {
            throw err;
        }
    }
};

// SceneIconMorph ops

SceneIconMorph.prototype.isProjectScene = function (anIDE) {
    // the first scene of a project cannot be renamed, deleted or rearranged,
    // because its name and project notes are those of the project
    var ide = anIDE || this.parentThatIsA(IDE_Morph);
    return ide.scenes.indexOf(this.object) === 1;
};

// SceneIconMorph drawing

SceneIconMorph.prototype.render
    = SpriteIconMorph.prototype.render;

// SceneIconMorph drag & drop

SceneIconMorph.prototype.rootForGrab = function () {
    return this;
};

SceneIconMorph.prototype.prepareToBeGrabbed = function () {
    this.mouseClickLeft(); // select me
    this.removeScene();
};

// SceneAlbumMorph ///////////////////////////////////////////////////////

// I am a watcher on a project's scenes list

// SceneAlbumMorph inherits from ScrollFrameMorph

SceneAlbumMorph.prototype = new ScrollFrameMorph();
SceneAlbumMorph.prototype.constructor = SceneAlbumMorph;
SceneAlbumMorph.uber = ScrollFrameMorph.prototype;

// SceneAlbumMorph instance creation:

function SceneAlbumMorph(anIDE, sliderColor) {
    this.init(anIDE, sliderColor);
}

SceneAlbumMorph.prototype.init = function (anIDE, sliderColor) {
    // additional properties
    this.ide = anIDE;
    this.scene = anIDE.scene;
    this.version = null;

    // initialize inherited properties
    SceneAlbumMorph.uber.init.call(this, null, null, sliderColor);

    // configure inherited properties
    // this.fps = 2; // commented out to make scrollbars more responsive
    this.updateList();
    this.updateSelection();
};

// SceneAlbumMorph updating

SceneAlbumMorph.prototype.updateList = function () {
    var x = this.left() + 5,
        y = this.top() + 5,
        padding = 4,
        oldPos = this.contents.position(),
        icon;

    this.changed();

    this.contents.destroy();
    this.contents = new FrameMorph(this);
    this.contents.acceptsDrops = false;
    this.contents.reactToDropOf = (icon) => {
        this.reactToDropOf(icon);
    };
    this.addBack(this.contents);

    this.ide.scenes.asArray().forEach((scene, i) => {
        icon = new SceneIconMorph(scene);
        if (i < 1) {
            icon.isDraggable = false; // project scene cannot be rearranged
        }
        icon.setPosition(new Point(x, y));
        this.addContents(icon);
        y = icon.bottom() + padding;
    });
    this.version = this.ide.scenes.lastChanged;

    this.contents.setPosition(oldPos);
    this.adjustScrollBars();
    this.changed();

    this.updateSelection();
};

SceneAlbumMorph.prototype.updateSelection = function () {
    this.scene = this.ide.scene;
    this.contents.children.forEach(function (morph) {
        if (morph.refresh) {
            morph.refresh();
        }
    });
};

// SceneAlbumMorph stepping

SceneAlbumMorph.prototype.step = function () {
    if (this.version !== this.ide.scenes.lastChanged) {
        this.updateList();
    }
    if (this.scene !== this.ide.scene) {
        this.updateSelection();
    }
};

// Wardrobe ops

SceneAlbumMorph.prototype.removeSceneAt = function (idx) {
    this.ide.scenes.remove(idx);
    this.updateList();
};

// SceneAlbumMorph drag & drop

SceneAlbumMorph.prototype.wantsDropOf = function (morph) {
    return morph instanceof SceneIconMorph;
};

SceneAlbumMorph.prototype.reactToDropOf = function (icon) {
    var idx = 0,
        scene = icon.object,
        top = icon.top();
    icon.destroy();
    this.contents.children.forEach(item => {
        if (item instanceof SceneIconMorph && item.top() < top - 4) {
            idx += 1;
        }
    });
    idx = Math.max(idx, 1); // the project scene cannot the rearranged
    this.ide.scenes.add(scene, idx + 1);
    this.updateList();
    icon.mouseClickLeft(); // select
};

// StageHandleMorph ////////////////////////////////////////////////////////

// I am a horizontal resizing handle for a StageMorph

// StageHandleMorph inherits from Morph:

StageHandleMorph.prototype = new Morph();
StageHandleMorph.prototype.constructor = StageHandleMorph;
StageHandleMorph.uber = Morph.prototype;

// StageHandleMorph instance creation:

function StageHandleMorph(target) {
    this.init(target);
}

StageHandleMorph.prototype.init = function (target) {
    this.target = target || null;
    this.offset = null;
    this.userState = 'normal'; // or 'highlight'
    HandleMorph.uber.init.call(this);
    this.color = IDE_Morph.prototype.isBright ?
            IDE_Morph.prototype.backgroundColor : new Color(190, 190, 190);
    this.isDraggable = false;
    this.setExtent(new Point(12, 50));
};

// StageHandleMorph drawing:

StageHandleMorph.prototype.render = function (ctx) {
    if (this.userState === 'highlight') {
        this.renderOn(
            ctx,
            IDE_Morph.prototype.isBright ?
                    new Color(245, 245, 255) : new Color(100, 100, 255),
            this.color
        );
    } else { // assume 'normal'
        this.renderOn(ctx, this.color);
    }
};

StageHandleMorph.prototype.renderOn = function (
    ctx,
    color,
    shadowColor
) {
    var l = this.height() / 8,
        w = this.width() / 6,
        r = w / 2,
        x,
        y,
        i;

    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    y = this.height() / 2;

    ctx.strokeStyle = color.toString();
    x = this.width() / 12;
    for (i = 0; i < 3; i += 1) {
        if (i > 0) {
            ctx.beginPath();
            ctx.moveTo(x, y - (l - r));
            ctx.lineTo(x, y + (l - r));
            ctx.stroke();
        }
        x += (w * 2);
        l *= 2;
    }
    if (shadowColor) {
        ctx.strokeStyle = shadowColor.toString();
        x = this.width() / 12 + w;
        l = this.height() / 8;
        for (i = 0; i < 3; i += 1) {
            if (i > 0) {
                ctx.beginPath();
                ctx.moveTo(x, y - (l - r));
                ctx.lineTo(x, y + (l - r));
                ctx.stroke();
            }
            x += (w * 2);
            l *= 2;
        }
    }
};

// StageHandleMorph layout:

StageHandleMorph.prototype.fixLayout = function () {
    if (!this.target) {return; }
    var ide = this.target.parentThatIsA(IDE_Morph);
    this.setTop(this.target.top() + 10);
    this.setRight(this.target.left());
    if (ide) {ide.add(this); } // come to front
};

// StageHandleMorph events:

StageHandleMorph.prototype.mouseEnter = function () {
    this.userState = 'highlight';
    this.rerender();
};

StageHandleMorph.prototype.mouseLeave = function () {
    this.userState = 'normal';
    this.rerender();
};

StageHandleMorph.prototype.mouseDownLeft = function (pos) {
    var ide = this.target.parentThatIsA(IDE_Morph);
    this.offset = this.right() - pos.x;
    ide.isSmallStage = true;
    ide.controlBar.stageSizeButton.refresh();
    this.lockMouseFocus();
};

StageHandleMorph.prototype.mouseMove = function (pos) {
    var ide = this.target.parentThatIsA(IDE_Morph),
        newPos = pos.x + this.offset,
        newWidth = this.target.right() - newPos;
    ide.stageRatio = newWidth / this.target.dimensions.x;
    if (ide.isSmallStage !== (ide.stageRatio !== 1)) {
        ide.isSmallStage = (ide.stageRatio !== 1);
        ide.controlBar.stageSizeButton.refresh();
    }
    ide.setExtent(ide.world().extent());
};

StageHandleMorph.prototype.mouseDoubleClick = function () {
    this.target.parentThatIsA(IDE_Morph).toggleStageSize(true, 1);
};

// PaletteHandleMorph ////////////////////////////////////////////////////////

// I am a horizontal resizing handle for a blocks palette
// I pseudo-inherit many things from StageHandleMorph

// PaletteHandleMorph inherits from Morph:

PaletteHandleMorph.prototype = new Morph();
PaletteHandleMorph.prototype.constructor = PaletteHandleMorph;
PaletteHandleMorph.uber = Morph.prototype;

// PaletteHandleMorph instance creation:

function PaletteHandleMorph(target) {
    this.init(target);
}

PaletteHandleMorph.prototype.init = function (target) {
    this.target = target || null;
    this.offset = null;
    this.userState = 'normal';
    HandleMorph.uber.init.call(this);
    this.color = IDE_Morph.prototype.isBright ?
            IDE_Morph.prototype.backgroundColor : new Color(190, 190, 190);
    this.isDraggable = false;
    this.setExtent(new Point(12, 50));
};

// PaletteHandleMorph drawing:

PaletteHandleMorph.prototype.render =
    StageHandleMorph.prototype.render;

PaletteHandleMorph.prototype.renderOn =
    StageHandleMorph.prototype.renderOn;

// PaletteHandleMorph layout:

PaletteHandleMorph.prototype.fixLayout = function () {
    if (!this.target) {return; }
    var ide = this.target.parentThatIsA(IDE_Morph);
    this.setTop(this.target.top() + 10);
    this.setRight(this.target.right());
    if (ide) {ide.add(this); } // come to front
};

// PaletteHandleMorph events:

PaletteHandleMorph.prototype.mouseEnter
    = StageHandleMorph.prototype.mouseEnter;

PaletteHandleMorph.prototype.mouseLeave
    = StageHandleMorph.prototype.mouseLeave;

PaletteHandleMorph.prototype.mouseDownLeft = function (pos) {
    this.offset = this.right() - pos.x;
    this.lockMouseFocus();
};

PaletteHandleMorph.prototype.mouseMove = function (pos) {
    var ide = this.target.parentThatIsA(IDE_Morph),
        cnf = ide.config,
        border = cnf.border || 0,
        newPos = pos.x + this.offset;
    ide.paletteWidth = Math.min(
        Math.max(
            200, newPos - ide.left() - border * 2),
            cnf.noSprites ?
                ide.width() - border * 2
                : ide.stageHandle.left() -
                    ide.spriteBar.tabBar.width()
    );
    ide.setExtent(ide.world().extent());
};

PaletteHandleMorph.prototype.mouseDoubleClick = function () {
    this.target.parentThatIsA(IDE_Morph).setPaletteWidth(200);
};

// CamSnapshotDialogMorph ////////////////////////////////////////////////////

/*
    I am a dialog morph that lets users take a snapshot using their webcam
    and use it as a costume for their sprites or a background for the Stage.
*/

// CamSnapshotDialogMorph inherits from DialogBoxMorph:

CamSnapshotDialogMorph.prototype = new DialogBoxMorph();
CamSnapshotDialogMorph.prototype.constructor = CamSnapshotDialogMorph;
CamSnapshotDialogMorph.uber = DialogBoxMorph.prototype;

// CamSnapshotDialogMorph settings

CamSnapshotDialogMorph.prototype.enableCamera = true;
CamSnapshotDialogMorph.prototype.enabled = true;

CamSnapshotDialogMorph.prototype.notSupportedMessage =
	'Please make sure your web browser is up to date\n' +
	'and your camera is properly configured. \n\n' +
	'Some browsers also require you to access Snap!\n' +
	'through HTTPS to use the camera.\n\n' +
    'Please replace the "http://" part of the address\n' +
    'in your browser by "https://" and try again.';

// CamSnapshotDialogMorph instance creation

function CamSnapshotDialogMorph(ide, sprite, onCancel, onAccept) {
    this.init(ide, sprite, onCancel, onAccept);
}

CamSnapshotDialogMorph.prototype.init = function (
    ide,
    sprite,
    onCancel,
	onAccept
) {
    this.ide = ide;
    this.sprite = sprite;
    this.padding = 10;
    this.oncancel = onCancel;
    this.accept = onAccept;
    this.videoElement = null; // an HTML5 video element
    this.videoView = new Morph(); // a morph where we'll copy the video contents
    this.videoView.isCachingImage = true;

    CamSnapshotDialogMorph.uber.init.call(this);
    this.labelString = 'Camera';
    this.createLabel();
    this.buildContents();
};

CamSnapshotDialogMorph.prototype.buildContents = function () {
    var myself = this,
        stage = this.sprite.parentThatIsA(StageMorph);

	function noCameraSupport() {
        myself.disable();
        myself.ide.inform(
            'Camera not supported',
            CamSnapshotDialogMorph.prototype.notSupportedMessage
        );
        if (myself.videoElement) {
        	myself.videoElement.remove();
        }
        myself.cancel();
	}

    this.videoElement = document.createElement('video');
    this.videoElement.hidden = true;
    this.videoElement.width = stage.dimensions.x;
    this.videoElement.height = stage.dimensions.y;

    document.body.appendChild(this.videoElement);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                this.videoElement.srcObject = stream;
                this.videoElement.play().catch(noCameraSupport);
                this.videoElement.stream = stream;
            }).catch(noCameraSupport);
    }

    this.videoView.setExtent(stage.dimensions);
    this.videoView.cachedImage = newCanvas(
        stage.dimensions,
        true, // retina, maybe overkill here
        this.videoView.cachedImage
    );

    this.videoView.drawOn = function (ctx, rect) {
        var videoWidth = myself.videoElement.videoWidth,
            videoHeight = myself.videoElement.videoHeight,
            w = stage.dimensions.x,
            h = stage.dimensions.y,
            clippingWidth, clippingHeight;

        if (!videoWidth) { return; }

        ctx.save();

        // Flip the image so it looks like a mirror
        ctx.translate(w, 0);
        ctx.scale(-1, 1);

        if (videoWidth / w > videoHeight / h) {
            // preserve height, crop width
            clippingWidth = w * (videoHeight / h);
            clippingHeight = videoHeight;
        } else {
            // preserve width, crop height
            clippingWidth = videoWidth;
            clippingHeight = h * (videoWidth / w);
        }

        ctx.drawImage(
            myself.videoElement,
            0,
            0,
            clippingWidth,
            clippingHeight,
            this.left() * -1,
            this.top(),
            w,
            h
            );

        ctx.restore();
    };

    this.videoView.step = function () {
        this.changed();
    };

    this.addBody(new AlignmentMorph('column', this.padding / 2));
    this.body.add(this.videoView);
    this.body.fixLayout();

    this.addButton('ok', 'Save');
    this.addButton('cancel', 'Cancel');

    this.fixLayout();
    this.rerender();
};

CamSnapshotDialogMorph.prototype.ok = function () {
    this.accept(
        new Costume(
            this.videoView.fullImage(),
            this.sprite.newCostumeName('camera'),
            null,
            true // no shrink-wrap
        ).flipped()
    );
};

CamSnapshotDialogMorph.prototype.disable = function () {
    CamSnapshotDialogMorph.prototype.enabled = false;
    document.dispatchEvent(new Event('cameraDisabled'));
};

CamSnapshotDialogMorph.prototype.destroy = function () {
    this.oncancel.call(this);
    this.close();
};

CamSnapshotDialogMorph.prototype.close = function () {
    if (this.videoElement && this.videoElement.stream) {
        this.videoElement.stream.getTracks()[0].stop();
        this.videoElement.remove();
    }
    CamSnapshotDialogMorph.uber.destroy.call(this);
};

// SoundRecorderDialogMorph ////////////////////////////////////////////////////

/*
    I am a dialog morph that lets users record sound snippets for their
    sprites or Stage.
*/

// SoundRecorderDialogMorph inherits from DialogBoxMorph:

SoundRecorderDialogMorph.prototype = new DialogBoxMorph();
SoundRecorderDialogMorph.prototype.constructor = SoundRecorderDialogMorph;
SoundRecorderDialogMorph.uber = DialogBoxMorph.prototype;

// SoundRecorderDialogMorph instance creation

function SoundRecorderDialogMorph(onAccept) {
    this.init(onAccept);
}

SoundRecorderDialogMorph.prototype.init = function (onAccept) {
    var myself = this;
    this.padding = 10;
    this.accept = onAccept;

    this.mediaRecorder = null; // an HTML5 MediaRecorder object
    this.audioElement = document.createElement('audio');
    this.audioElement.hidden = true;
    this.audioElement.onended = function (event) {
        myself.stop();
    };
    document.body.appendChild(this.audioElement);

    this.recordButton = null;
    this.stopButton = null;
    this.playButton = null;
    this.progressBar = new BoxMorph();

    SoundRecorderDialogMorph.uber.init.call(this);
    this.labelString = 'Sound Recorder';
    this.createLabel();
    this.buildContents();
};

SoundRecorderDialogMorph.prototype.buildContents = function () {
    var audioChunks = [];

    this.recordButton = new PushButtonMorph(
        this,
        'record',
        new SymbolMorph('circleSolid', 10)
    );

    this.stopButton = new PushButtonMorph(
        this,
        'stop',
        new SymbolMorph('rectangleSolid', 10)
    );

    this.playButton = new PushButtonMorph(
        this,
        'play',
        new SymbolMorph('pointRight', 10)
    );

    this.buildProgressBar();

    this.addBody(new AlignmentMorph('row', this.padding));
    this.body.add(this.recordButton);
    this.body.add(this.stopButton);
    this.body.add(this.playButton);
    this.body.add(this.progressBar);

    this.body.fixLayout();

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(
            {
                audio: {
                    channelCount: 1 // force mono, currently only works on FF
                }

            }
        ).then(stream => {
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            this.mediaRecorder.onstop = (event) => {
                var buffer = new Blob(audioChunks),
                    reader = new window.FileReader();
                reader.readAsDataURL(buffer);
                reader.onloadend = () => {
                    var base64 = reader.result;
                    base64 = 'data:audio/mpeg;base64,' +
                        base64.split(',')[1];
                    this.audioElement.src = base64;
                    this.audioElement.load();
                    audioChunks = [];
                };
            };
        });
    }

    this.addButton('ok', 'Save');
    this.addButton('cancel', 'Cancel');

    this.fixLayout();
    this.rerender();
};

SoundRecorderDialogMorph.prototype.buildProgressBar = function () {
    var line = new Morph(),
        myself = this;

    this.progressBar.setExtent(new Point(150, 20));
    this.progressBar.setColor(new Color(200, 200, 200));
    this.progressBar.setBorderWidth(1);
    this.progressBar.setBorderColor(new Color(150, 150, 150));

    line.setExtent(new Point(130, 2));
    line.setColor(new Color(50, 50, 50));
    line.setCenter(this.progressBar.center());
    this.progressBar.add(line);

    this.progressBar.indicator = new Morph();
    this.progressBar.indicator.setExtent(new Point(5, 15));
    this.progressBar.indicator.setColor(new Color(50, 200, 50));
    this.progressBar.indicator.setCenter(line.leftCenter());

    this.progressBar.add(this.progressBar.indicator);

    this.progressBar.setPercentage = function (percentage) {
        this.indicator.setLeft(
            line.left() +
            (line.width() / 100 * percentage) -
            this.indicator.width() / 2
        );
    };

    this.progressBar.step = function () {
        if (myself.audioElement.duration) {
            this.setPercentage(
                myself.audioElement.currentTime /
                myself.audioElement.duration * 100);
        } else {
            this.setPercentage(0);
        }
    };
};

SoundRecorderDialogMorph.prototype.record = function () {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.stop();
        return;
    }

    this.mediaRecorder.start();
    this.recordButton.label.setColor(new Color(255, 0, 0));
    this.playButton.label.setColor(new Color(0, 0, 0));
};

SoundRecorderDialogMorph.prototype.stop = function () {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
    }

    this.audioElement.pause();
    this.audioElement.currentTime = 0;

    this.recordButton.label.setColor(new Color(0, 0, 0));
    this.playButton.label.setColor(new Color(0, 0, 0));
};

SoundRecorderDialogMorph.prototype.play = function () {
    try {
        this.audioElement.play();
    } catch (err) {
        this.audioElement.oncanplaythrough = function () {
            this.play();
            this.oncanplaythrough = nop;
        };
    }
    this.playButton.label.setColor(new Color(0, 255, 0));
};

SoundRecorderDialogMorph.prototype.ok = function () {
    var myself = this;
    this.stop();
    if (this.audioElement.readyState === 4) {
        myself.accept(this.audioElement);
        myself.destroy();
    } else {
        this.audioElement.oncanplaythrough = function () {
            if (this.duration && this.duration !== Infinity) {
                myself.accept(this);
                this.oncanplaythrough = nop;
                myself.destroy();
            } else {
                // For some reason, we need to play the sound
                // at least once to get its duration.
                myself.buttons.children.forEach(button =>
                    button.disable()
                );
                this.play();
            }
        };
    }
};

SoundRecorderDialogMorph.prototype.destroy = function () {
    this.stop();
    this.audioElement.remove();
    if (this.mediaRecorder && this.mediaRecorder.stream) {
        this.mediaRecorder.stream.getTracks()[0].stop();
    }
    SoundRecorderDialogMorph.uber.destroy.call(this);
};
