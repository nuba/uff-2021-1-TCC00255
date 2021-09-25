settings = {

  scene_translate_x: 0,
  scene_translate_y: 0,
  scene_translate_z: -90,

  scene_rotate_x: -70,
  scene_rotate_y: 0,
  scene_rotate_z: -60,

  hand_translate_x: 8,
  hand_translate_y: -24,
  hand_translate_z: 6.5,
  hand_rotate_x   : 90,
  hand_rotate_y   : 90,
  hand_rotate_z   : 10,

  hand_miolo1_flex: 0,
  hand_miolo2_flex: 10,

  hand_d1a_flex_x: 10,
  hand_d1a_flex_y: 10,
  hand_d1b_flex: 15,
  hand_d1c_flex: 10,

  hand_d2a_flex_x: 10,
  hand_d2a_flex_y: 10,
  hand_d2b_flex: 15,
  hand_d2c_flex: 10,

  hand_d3a_flex_x: 10,
  hand_d3a_flex_y: 10,
  hand_d3b_flex: 15,
  hand_d3c_flex: 10,

  hand_d4a_flex_x: 10,
  hand_d4a_flex_y: 10,
  hand_d4b_flex: 15,
  hand_d4c_flex: 10,

  hand_opositor2_flex_x: 15,
  hand_opositor2_flex_y: 55,

  hand_opositor3_flex_x: 15,
  hand_opositor3_flex_y: 55,

  renderingMode: 'TRIANGLES',

  terrain_enabled      : true,
  terrain_interpolation: 15,

  water_enabled      : true,
  water_interpolation: 1,
  water_level        : 0,

  stones_enabled      : true,
  stones_interpolation: 3,

  monolith_enabled: true,
  hand_enabled    : true,

  hand_opositor1_flex_x: 0,
  hand_opositor1_flex_y: -75,

  hand_scale_x: 1,
  hand_scale_y: 1,
  hand_scale_z: 1,

};

function setupPanel() {

  let settingsPanel_terrain = QuickSettings
      .create(20, 20, 'Scene Elements')
      .setGlobalChangeHandler(settingsChangedFn)
      .bindDropDown('renderingMode', [
        {index: 0, label: 'TRIANGLES', value: 'TRIANGLES'},
        {index: 0, label: 'LINES', value: 'LINES'},
      ], settings)
      .addHTML('Hierarquia', '* water<BR>* stones<br>* terrain<br>&nbsp;&nbsp;&nbsp;* monolith<br>&nbsp;&nbsp;&nbsp;* hand')
      .bindBoolean('monolith_enabled', settings.monolith_enabled, settings)
      .bindBoolean('hand_enabled', settings.hand_enabled, settings)

      .addHTML('Terrain', '')
      .bindBoolean('terrain_enabled', settings.terrain_enabled, settings)
      .bindRange('terrain_interpolation', 1, 15, settings.terrain_interpolation, 1, settings)

      .addHTML('Water', '')
      .bindBoolean('water_enabled', settings.water_enabled, settings)
      .bindRange('water_interpolation', 1, 15, settings.water_interpolation, 1, settings)
      .bindRange('water_level', -10, 30, settings.water_interpolation, 1, settings)

      .addHTML('Stones', '')
      .bindBoolean('stones_enabled', settings.stones_enabled, settings)
      .bindRange('stones_interpolation', 1, 15, settings.stones_interpolation, 1, settings);

  let settingsPanel  = QuickSettings
      .create(200, 20, 'Situação da Cena')
      .setGlobalChangeHandler(settingsChangedFn)
      .addHTML('Translate x, y, z', '')
      .bindRange('scene_translate_x', -300, 300, settings.scene_translate_x, 1, settings)
      .hideTitle('scene_translate_x')
      .bindRange('scene_translate_y', -300, 300, settings.scene_translate_y, 1, settings)
      .hideTitle('scene_translate_y')
      .bindRange('scene_translate_z', -300, 300, settings.scene_translate_z, 1, settings)
      .hideTitle('scene_translate_z')
      .addHTML('Rotate x, y, z', '')
      .bindRange('scene_rotate_x', -180, 180, settings.scene_rotate_x, 1, settings)
      .hideTitle('scene_rotate_x')
      .bindRange('scene_rotate_y', -180, 180, settings.scene_rotate_y, 1, settings)
      .hideTitle('scene_rotate_y')
      .bindRange('scene_rotate_z', -180, 180, settings.scene_rotate_z, 1, settings)
      .hideTitle('scene_rotate_z')
  ;
  let settingsPanel2 = QuickSettings
      .create(window.innerWidth - 360, 20, 'Mão')
      .setGlobalChangeHandler(settingsChangedFn)
      .addHTML('Translate x, y, z', '')
      .bindRange('hand_translate_x', -30, 30, settings.hand_translate_x, 1, settings)
      .hideTitle('hand_translate_x')
      .bindRange('hand_translate_y', -30, 30, settings.hand_translate_y, 1, settings)
      .hideTitle('hand_translate_y')
      .bindRange('hand_translate_z', -30, 30, settings.hand_translate_z, 1, settings)
      .hideTitle('hand_translate_z')
      .addHTML('Rotate x, y, z', '')
      .bindRange('hand_rotate_x', -180, 180, settings.hand_rotate_x, 1, settings)
      .hideTitle('hand_rotate_x')
      .bindRange('hand_rotate_y', -180, 180, settings.hand_rotate_y, 1, settings)
      .hideTitle('hand_rotate_y')
      .bindRange('hand_rotate_z', -180, 180, settings.hand_rotate_z, 1, settings)
      .hideTitle('hand_rotate_z')
      .addHTML('Scale x, y, z', '')
      .bindRange('hand_scale_x', -30, 30, settings.hand_scale_x, 1, settings)
      .hideTitle('hand_scale_x')
      .bindRange('hand_scale_y', -30, 30, settings.hand_scale_y, 1, settings)
      .hideTitle('hand_scale_y')
      .bindRange('hand_scale_z', -30, 30, settings.hand_scale_z, 1, settings)
      .hideTitle('hand_scale_z')
  ;

  let settingsPanel3 = QuickSettings
      .create(window.innerWidth - 180, 20, 'Flexões')
      .setGlobalChangeHandler(settingsChangedFn)
      .addHTML('Miolo', '')
      .bindRange('hand_miolo1_flex', -180, 180, settings.hand_miolo1_flex, 1, settings)
      .hideTitle('hand_miolo1_flex')
      .bindRange('hand_miolo2_flex', -180, 180, settings.hand_miolo2_flex, 1, settings)
      .hideTitle('hand_miolo2_flex')
      .addHTML('Dedo 1', '')
      .bindRange('hand_d1a_flex_x', -180, 180, settings.hand_d1a_flex_x, 1, settings)
      .hideTitle('hand_d1a_flex_x')
      .bindRange('hand_d1a_flex_y', -180, 180, settings.hand_d1a_flex_y, 1, settings)
      .hideTitle('hand_d1a_flex_y')
      .bindRange('hand_d1b_flex', -180, 180, settings.hand_d1b_flex, 1, settings)
      .hideTitle('hand_d1b_flex')
      .bindRange('hand_d1c_flex', -180, 180, settings.hand_d1c_flex, 1, settings)
      .hideTitle('hand_d1c_flex')
      .addHTML('Dedo 2', '')
      .bindRange('hand_d2a_flex_x', -180, 180, settings.hand_d2a_flex_x, 1, settings)
      .hideTitle('hand_d2a_flex_x')
      .bindRange('hand_d2a_flex_y', -180, 180, settings.hand_d2a_flex_y, 1, settings)
      .hideTitle('hand_d2a_flex_y')
      .bindRange('hand_d2b_flex', -180, 180, settings.hand_d2b_flex, 1, settings)
      .hideTitle('hand_d2b_flex')
      .bindRange('hand_d2c_flex', -180, 180, settings.hand_d2c_flex, 1, settings)
      .hideTitle('hand_d2c_flex')
      .addHTML('Dedo 3', '')
      .bindRange('hand_d3a_flex_x', -180, 180, settings.hand_d3a_flex_x, 1, settings)
      .hideTitle('hand_d3a_flex_x')
      .bindRange('hand_d3a_flex_y', -180, 180, settings.hand_d3a_flex_y, 1, settings)
      .hideTitle('hand_d3a_flex_y')
      .bindRange('hand_d3b_flex', -180, 180, settings.hand_d3b_flex, 1, settings)
      .hideTitle('hand_d3b_flex')
      .bindRange('hand_d3c_flex', -180, 180, settings.hand_d3c_flex, 1, settings)
      .hideTitle('hand_d3c_flex')
      .addHTML('Dedo 4', '')
      .bindRange('hand_d4a_flex_x', -180, 180, settings.hand_d4a_flex_x, 1, settings)
      .hideTitle('hand_d4a_flex_x')
      .bindRange('hand_d4a_flex_y', -180, 180, settings.hand_d4a_flex_y, 1, settings)
      .hideTitle('hand_d4a_flex_y')
      .bindRange('hand_d4b_flex', -180, 180, settings.hand_d4b_flex, 1, settings)
      .hideTitle('hand_d4b_flex')
      .bindRange('hand_d4c_flex', -180, 180, settings.hand_d4c_flex, 1, settings)
      .hideTitle('hand_d4c_flex')
      .addHTML('Opositor', '')
      .bindRange('hand_opositor1_flex_x', -180, 180, settings.hand_opositor1_flex_x, 1, settings)
      .hideTitle('hand_opositor1_flex_x')
      .bindRange('hand_opositor1_flex_y', -180, 180, settings.hand_opositor1_flex_y, 1, settings)
      .hideTitle('hand_opositor1_flex_y')
      .bindRange('hand_opositor2_flex_x', -180, 180, settings.hand_opositor2_flex_x, 1, settings)
      .hideTitle('hand_opositor2_flex_x')
      .bindRange('hand_opositor2_flex_y', -180, 180, settings.hand_opositor2_flex_y, 1, settings)
      .hideTitle('hand_opositor2_flex_y')
      .bindRange('hand_opositor3_flex_x', -180, 180, settings.hand_opositor3_flex_x, 1, settings)
      .hideTitle('hand_opositor3_flex_x')
      .bindRange('hand_opositor3_flex_y', -180, 180, settings.hand_opositor3_flex_y, 1, settings)
      .hideTitle('hand_opositor3_flex_y')
  ;


  settingsChangedFn();

}

function debounceWithThrottle(func, debouncewait, throttlewait, callatstart, callatend) {
  var debouncetimeout, throttletimeout;

  return function () {
    var context = this, args = arguments;

    if (callatstart && !debouncetimeout) {
      func.apply(context, [].concat(args, 'start'));
    }

    if (!throttletimeout && throttlewait > 0) {
      throttletimeout = setInterval(function () {
        func.apply(context, [].concat(args, 'during'));
      }, throttlewait);
    }

    clearTimeout(debouncetimeout);
    debouncetimeout = setTimeout(function () {
      clearTimeout(throttletimeout);
      throttletimeout = null;
      debouncetimeout = null;

      if (callatend) {
        func.apply(context, [].concat(args, 'end'));
      }
    }, debouncewait);
  };
};

var settingsChangedFn = debounceWithThrottle(
    function () {

      renderingMode = settings.renderingMode;

      scene.translate = [
        settings.scene_translate_x,
        settings.scene_translate_y,
        settings.scene_translate_z,
      ];

      scene.rotate = [
        settings.scene_rotate_x,
        settings.scene_rotate_y,
        settings.scene_rotate_z,
      ];

      scene.setAttribute('terrain.hand', 'translate[0]', settings.hand_translate_x);
      scene.setAttribute('terrain.hand', 'translate[1]', settings.hand_translate_y);
      scene.setAttribute('terrain.hand', 'translate[2]', settings.hand_translate_z);

      scene.setAttribute('terrain.hand', 'rotate[0]', settings.hand_rotate_x);
      scene.setAttribute('terrain.hand', 'rotate[1]', settings.hand_rotate_y);
      scene.setAttribute('terrain.hand', 'rotate[2]', settings.hand_rotate_z);

      scene.setAttribute('terrain.hand', 'scale[0]', settings.hand_scale_x);
      scene.setAttribute('terrain.hand', 'scale[1]', settings.hand_scale_y);
      scene.setAttribute('terrain.hand', 'scale[2]', settings.hand_scale_z);

      scene.setAttribute('terrain.hand.miolo1', 'rotate[0]', settings.hand_miolo1_flex);
      scene.setAttribute('terrain.hand.miolo1.miolo2', 'rotate[0]', settings.hand_miolo2_flex);

      scene.setAttribute('terrain.hand.miolo1.miolo2.d1a', 'rotate[0]', settings.hand_d1a_flex_x);
      scene.setAttribute('terrain.hand.miolo1.miolo2.d1a', 'rotate[1]', settings.hand_d1a_flex_y);
      scene.setAttribute('terrain.hand.miolo1.miolo2.d1a.d1b', 'rotate[0]', settings.hand_d1b_flex);
      scene.setAttribute('terrain.hand.miolo1.miolo2.d1a.d1b.d1c', 'rotate[0]', settings.hand_d1c_flex);

      scene.setAttribute('terrain.hand.miolo1.miolo2.d2a', 'rotate[0]', settings.hand_d2a_flex_x);
      scene.setAttribute('terrain.hand.miolo1.miolo2.d2a', 'rotate[1]', settings.hand_d2a_flex_y);
      scene.setAttribute('terrain.hand.miolo1.miolo2.d2a.d2b', 'rotate[0]', settings.hand_d2b_flex);
      scene.setAttribute('terrain.hand.miolo1.miolo2.d2a.d2b.d2c', 'rotate[0]', settings.hand_d2c_flex);

      scene.setAttribute('terrain.hand.miolo1.miolo2.d3a', 'rotate[0]', settings.hand_d3a_flex_x);
      scene.setAttribute('terrain.hand.miolo1.miolo2.d3a', 'rotate[1]', settings.hand_d3a_flex_y);
      scene.setAttribute('terrain.hand.miolo1.miolo2.d3a.d3b', 'rotate[0]', settings.hand_d3b_flex);
      scene.setAttribute('terrain.hand.miolo1.miolo2.d3a.d3b.d3c', 'rotate[0]', settings.hand_d3c_flex);

      scene.setAttribute('terrain.hand.miolo1.miolo2.d4a', 'rotate[0]', settings.hand_d4a_flex_x);
      scene.setAttribute('terrain.hand.miolo1.miolo2.d4a', 'rotate[1]', settings.hand_d4a_flex_y);
      scene.setAttribute('terrain.hand.miolo1.miolo2.d4a.d4b', 'rotate[0]', settings.hand_d4b_flex);
      scene.setAttribute('terrain.hand.miolo1.miolo2.d4a.d4b.d4c', 'rotate[0]', settings.hand_d4c_flex);

      scene.setAttribute('terrain.hand.opositor1', 'rotate[0]', settings.hand_opositor1_flex_x);
      scene.setAttribute('terrain.hand.opositor1', 'rotate[1]', settings.hand_opositor1_flex_y);

      scene.setAttribute('terrain.hand.opositor1.opositor2', 'rotate[0]', settings.hand_opositor2_flex_x);
      scene.setAttribute('terrain.hand.opositor1.opositor2', 'rotate[1]', settings.hand_opositor2_flex_y);

      scene.setAttribute('terrain.hand.opositor1.opositor2.opositor3', 'rotate[0]', settings.hand_opositor3_flex_x);
      scene.setAttribute('terrain.hand.opositor1.opositor2.opositor3', 'rotate[1]', settings.hand_opositor3_flex_y);

      scene.setAttribute('terrain', 'enabled', settings.terrain_enabled);
      scene.setAttribute('water', 'enabled', settings.water_enabled);
      scene.setAttribute('stones', 'enabled', settings.stones_enabled);
      scene.setAttribute('terrain.monolito', 'enabled', settings.monolith_enabled);
      scene.setAttribute('terrain.hand', 'enabled', settings.hand_enabled);

      scene.setAttribute('water', 'translate[2]', settings.water_level);

      function extractOldModelParams(oldModel, fatorInterpolacao) {
        return {
          program          : oldModel.shape3d.program,
          gl               : oldModel.shape3d.gl,
          color            : oldModel.shape3d.color,
          textureName      : oldModel.shape3d.textureName,
          mMin             : oldModel.terrain.mMin,
          mMax             : oldModel.terrain.mMax,
          nMin             : oldModel.terrain.nMin,
          nMax             : oldModel.terrain.nMax,
          zValues          : oldModel.terrain.zValues,
          fatorInterpolacao: fatorInterpolacao,
        };
      }

      if (scene.children['terrain'].model.terrain.fatorInterpolacao !== settings.terrain_interpolation) {
        scene.children['terrain'].model =
            new TerrainShape3d(
                extractOldModelParams(
                    scene.children['terrain'].model,
                    settings.terrain_interpolation));
      }

      if (scene.children['water'].model.terrain.fatorInterpolacao !== settings.water_interpolation) {
        scene.children['water'].model =
            new TerrainShape3d(
                extractOldModelParams(
                    scene.children['water'].model,
                    settings.water_interpolation,
                ),
            );
      }

      if (scene.children['stones'].model.terrain.fatorInterpolacao !== settings.stones_interpolation) {
        scene.children['stones'].model =
            new TerrainShape3d(
                extractOldModelParams(
                    scene.children['stones'].model,
                    settings.stones_interpolation,
                ),
            );
      }

      render();

    },
    50,
    50,
    false,
    true);
