/**
 * User: plepers
 * Date: 22/10/13 17:48
 */

(function (dragonBones) {

  var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
  };
  (function (display) {

    var PixiDisplayBridge = (function () {
      function PixiDisplayBridge() {
      }
      PixiDisplayBridge.prototype.getVisible = function () {
        return this._display ? this._display.visible : false;
      };
      PixiDisplayBridge.prototype.setVisible = function (value) {
        if (this._display) {
          this._display.visible = value;
        }
      };

      PixiDisplayBridge.prototype.getDisplay = function () {
        return this._display;
      };
      PixiDisplayBridge.prototype.setDisplay = function (value) {
        if (this._display == value) {
          return;
        }
        if (this._display) {
          var parent = this._display.parent;
          if (parent) {
            var index = this._display.parent.children.indexOf(this._display);
          }
          this.removeDisplay();
        }
        this._display = value;
        this.addDisplay(parent, index);
      };

      PixiDisplayBridge.prototype.dispose = function () {
        this._display = null;
      };

      PixiDisplayBridge.prototype.updateTransform = function (matrix, transform) {
        this._display.position.x = matrix.tx;
        this._display.position.y = matrix.ty;
        this._display.rotation = transform.skewX;
        this._display.scale.x = transform.scaleX;
        this._display.scale.y = transform.scaleY;
      };

      PixiDisplayBridge.prototype.updateColor = function (aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier) {
        if (this._display) {
          this._display.alpha = aMultiplier;
        }
      };

      PixiDisplayBridge.prototype.addDisplay = function (container, index) {
        var parent = container;
        if (parent && this._display) {
          if (index < 0) {
            parent.addChild(this._display);
          } else {
            parent.addChildAt(this._display, Math.min(index, parent.getNumChildren()));
          }
        }
      };

      PixiDisplayBridge.prototype.removeDisplay = function () {
        if (this._display && this._display.parent) {
          this._display.parent.removeChild(this._display);
        }
      };
      PixiDisplayBridge.RADIAN_TO_ANGLE = 180 / Math.PI;
      return PixiDisplayBridge;
    })();
    display.PixiDisplayBridge = PixiDisplayBridge;
  })(dragonBones.display || (dragonBones.display = {}));
  var display = dragonBones.display;

  (function (textures) {
    var PixiTextureAtlas = (function () {
      function PixiTextureAtlas(image, textureAtlasRawData, scale) {
        if (typeof scale === "undefined") { scale = 1; }
        this._regions = {};

        this.texture = new PIXI.BaseTexture(image);
        this.scale = scale;

        this.parseData(textureAtlasRawData);
      }
      PixiTextureAtlas.prototype.dispose = function () {
        this.texture = null;
        this._regions = null;
      };

      PixiTextureAtlas.prototype.getRegion = function (subTextureName) {
        return this._regions[subTextureName];
      };

      PixiTextureAtlas.prototype.parseData = function (textureAtlasRawData) {
        var frame;
        var textureAtlasData = dragonBones.objects.DataParser.parseTextureAtlasData(textureAtlasRawData, this.scale);
        this.name = textureAtlasData.__name;
        delete textureAtlasData.__name;

        for (var subTextureName in textureAtlasData) {
          frame = textureAtlasData[subTextureName];
          this._regions[subTextureName] =
          PIXI.TextureCache[frame.name] = new PIXI.Texture(this.texture, frame);
        }
      };
      return PixiTextureAtlas;
    })();
    textures.PixiTextureAtlas = PixiTextureAtlas;
  })(dragonBones.textures || (dragonBones.textures = {}));
  var textures = dragonBones.textures;

  (function (factorys) {
    var PixiFactory = (function (_super) {
      __extends(PixiFactory, _super);
      function PixiFactory() {
        _super.call(this);
      }
      PixiFactory.prototype._generateArmature = function () {
        var armature = new dragonBones.Armature(new PIXI.DisplayObjectContainer());
        return armature;
      };

      PixiFactory.prototype._generateSlot = function () {
        var slot = new dragonBones.Slot(new display.PixiDisplayBridge());
        return slot;
      };

      PixiFactory.prototype._generateDisplay = function (textureAtlas, fullName, pivotX, pivotY) {
        var texture = textureAtlas.getRegion(fullName);
        if (texture) {
          var sprite = new PIXI.Sprite(texture);
          sprite.pivot.x = pivotX;
          sprite.pivot.y = pivotY;
          // scale???
        }
        return sprite;
      };
      return PixiFactory;
    })(factorys.BaseFactory);
    factorys.PixiFactory = PixiFactory;
  })(dragonBones.factorys || (dragonBones.factorys = {}));
  var factorys = dragonBones.factorys;
})(root.dragonBones);