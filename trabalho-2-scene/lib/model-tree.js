class ModelTree {
  translate = [0, 0, 0];
  rotate    = [0, 0, 0];
  scale     = [1, 1, 1];
  children  = [];

  constructor({translate, rotate, scale, childrenList}) {
    this.translate = translate;
    this.rotate    = rotate;
    this.scale     = scale;
    childrenList.forEach(
        childParameters => {
          const childSlug          = childParameters.slug;
          this.children[childSlug] = new ModelTreeNode(childParameters);
        });
  }

  draw(renderingMode) {
    let modelViewMatrix = mat4.create();
    this.applyTranslationRotation(modelViewMatrix);
    this.applyScale(modelViewMatrix);
    for (const [childSlug, childNode] of Object.entries(this.children)) {
      console.log('ModelTree root drawing child %s', childSlug);
      childNode.draw(modelViewMatrix, renderingMode);
    }
  }

  applyTranslationRotation(modelViewMatrix) {
    // portei do Shape3D fornecido
    let tv = vec3.create();
    vec3.set(tv, ...this.translate);
    mat4.translate(modelViewMatrix, modelViewMatrix, tv);
    mat4.rotateX(modelViewMatrix, modelViewMatrix, this.rotate[0] * Math.PI / 180);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, this.rotate[1] * Math.PI / 180);
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, this.rotate[2] * Math.PI / 180);
  }

  applyScale(modelViewMatrix) {
    let s = vec3.create();
    vec3.set(s, ...this.scale);
    mat4.scale(modelViewMatrix, modelViewMatrix, s);
  }

  setAttribute(pathString, attribute, value) {
    let path = _.split(pathString, '.');
    if (path.length === 1) {
      _.set(this.children[path[0]], attribute, value);
    }
    else if (path.length !== 0) {
      const targetSlug = path.shift();
      this.children[targetSlug].setAttribute(path, attribute, value);
    }
  }

}

class ModelTreeNode {
  enabled  = true;
  slug;
  model;
  children = {};
  translate;
  rotate;
  scale;

  constructor(
      {
        slug,
        model,
        translate = [0, 0, 0],
        rotate = [0, 0, 0],
        scale = [1, 1, 1],
        childrenList = [],
      },
  ) {
    this.slug      = slug;
    this.model     = model;
    this.translate = translate;
    this.rotate    = rotate;
    this.scale     = scale;
    childrenList.forEach(
        childParameters => {
          const childSlug = childParameters.slug;
          return this.children[childSlug] = new ModelTreeNode(childParameters);
        });
  }

  setAttribute(path, attribute, value) {
    if (path.length === 1) {
      _.set(this.children[path[0]], attribute, value);
    }
    else if (path.length !== 0) {
      const targetSlug = path.shift();
      this.children[targetSlug].setAttribute(path, attribute, value);
    }
  }

  draw(parentModelViewMatrix, renderingMode) {
    if (!this.enabled) {
      return;
    }
    console.log('objeto %s draw()', this.slug);

    // ao invés de gerenciar manualmente um stack de matrizes,
    // deixo para a linguagem gerenciar um stack de recursao

    let modelViewMatrix = mat4.clone(parentModelViewMatrix);
    this.applyTranslationRotation(modelViewMatrix);

    if (this.model) {
      this.drawChildren(modelViewMatrix, renderingMode);
      this.applyScale(modelViewMatrix);
      this.drawSelf(modelViewMatrix, renderingMode);
    }
    else {
      this.applyScale(modelViewMatrix);
      this.drawChildren(modelViewMatrix, renderingMode);
    }
  }

  drawSelf(modelViewMatrix, renderingMode) {
    // FIXME gambiarra pra diferenciar shape3D (prof) de shape3d wrapped (meu)
    setProgramMatrices(
        !!this.model.shape3d && !!this.model.shape3d.program
        ? this.model.shape3d.program
        : this.model.program,
        modelViewMatrix,
    );
    this.model.draw(renderingMode);
  }

  drawChildren(modelViewMatrix, renderingMode) {
    for (const [childSlug, childNode] of Object.entries(this.children)) {
      console.log('%s drawing child %s', this.slug, childSlug);
      childNode.draw(modelViewMatrix, renderingMode);
    }
  }

  applyTranslationRotation(modelViewMatrix) {
    // portei do Shape3D fornecido
    let tv = vec3.create();
    vec3.set(tv, ...this.translate);
    mat4.translate(modelViewMatrix, modelViewMatrix, tv);
    mat4.rotateX(modelViewMatrix, modelViewMatrix, this.rotate[0] * Math.PI / 180);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, this.rotate[1] * Math.PI / 180);
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, this.rotate[2] * Math.PI / 180);
  }

  applyScale(modelViewMatrix) {
    let s = vec3.create();
    vec3.set(s, ...this.scale);
    mat4.scale(modelViewMatrix, modelViewMatrix, s);
  }
}
