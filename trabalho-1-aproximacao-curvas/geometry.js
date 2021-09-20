const EPS = 1e-6;

const TOL           = 1e-6;
const VERTEX_TOL    = 5;
const PrimitiveType = {POINT: 1, CIRCLE: 2, LINE: 3, RECTANGLE: 4, POLYGON: 5, FREE: 6};

function equal_float(x, y) {
  return (Math.abs(x - y) <= TOL);
}

class Vector3d {
  constructor(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get z() {
    return this._z;
  }

  set x(x) {
    this._x = x;
  }

  set y(y) {
    this._y = y;
  }

  set z(z) {
    this._z = z;
  }

  isEqualTo(v) {
    return ((this.x - v.x) * (this.x - v.x) +
            (this.y - v.y) * (this.y - v.y) +
            (this.y - v.z) * (this.y - v.z) < EPS);
  }

  normalize() {
    var v    = new Vector3d(this.x, this.y, this.z);
    var norm = Math.sqrt((this.x) * (this.x) + (this.y) * (this.y) + (this.z) * (this.z));
    if (norm >= EPS) {
      v.x /= norm;
      v.y /= norm;
      v.z /= norm;
    }
    else {
      v.x = 0.0;
      v.y = 0.0;
      v.z = 0.0;
    }
    return v;
  }

  dot(v) {
    return (this.x) * (v.x) + (this.y) * (v.y) + (this.z) * (v.z);
  }

  cross(v) {
    var w = new Vector3d(0.0, 0.0, 0.0);
    w.x   = this.y * v.z - this.z * v.y;
    w.y   = this.z * v.x - this.x * v.z;
    w.z   = this.x * v.y - this.y * v.x;

    return w;
  }

}

class LineSegment3d {
  constructor(p0, p1) {
    this._p0 = p0;
    this._p1 = p1;
  }

  get p0() {
    return this._p0;
  }

  get p1() {
    return this._p1;
  }

  set p0(p0) {
    this._p0 = p0;
  }

  set p1(p1) {
    this._p1 = p1;
  }

  lineToPlaneIntersection(plane) {
    var p0 = this.p0;
    var p1 = this.p1;
    var pp = plane.p;
    var n  = plane.n;

    var v = new Vector3d(p1.x - p0.x, p1.y - p0.y, p1.z - p0.z);
    var q = new Vector3d(p0.x - pp.x, p0.y - pp.y, p0.z - pp.z);

    var result = [false, undefined, undefined];

    var num = q.dot(n);
    var den = v.dot(n);

    if (Math.abs(den) > 0) {
      var t     = -num / den;
      result[1] = t;

      if (t >= 0 && t <= 1) {
        result[0]        = true;
        result[2]        = new Vector3d(p0.x + t * v.x, p0.y + t * v.y, p0.z + t * v.z);
      }
    }

    return result;
  }
}

class Plane3d {

  constructor(point, normal) {
    this._p = point;
    this._n = normal;
  }

  get p() {
    return this._p;
  }

  get n() {
    return this._n;
  }

  set p(point) {
    this._p = point;
  }

  set n(normal) {
    this._n = normal;
  }

  static buildFromTriangle(p0, p1, p2) {

    var u = new Vector3d(p1.x - p0.x, p1.y - p0.y, p2.z - p0.z);
    var v = new Vector3d(p2.x - p0.x, p2.y - p0.y, p2.z - p0.z);
    var n = u.cross(v);
    n     = n.normalize();
    return new Plane3d(p0, n);

  }

}
