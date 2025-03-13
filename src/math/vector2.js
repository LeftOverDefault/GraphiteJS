class Vector2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let magnitude = this.magnitude();
        if (magnitude === 0) {
            throw new Error("Cannot normalize a Vector Zero.");
        }
        this.x /= magnitude;
        this.y /= magnitude;
    }

    dot (v) {
        return this.x * v.x + this.y * v.y;
    }

    angle(useRadians) {
		return Math.atan2(this.y, this.x) * (useRadians ? 1 : Vector2Const.TO_DEGREES);
	}

    rotate(angle, useRadians) {
		
		var cosRY = Math.cos(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
		var sinRY = Math.sin(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
	
		Vector2Const.temp.copyFrom(this); 

		this.x= (Vector2Const.temp.x*cosRY)-(Vector2Const.temp.y*sinRY);
		this.y= (Vector2Const.temp.x*sinRY)+(Vector2Const.temp.y*cosRY);
		
		return this; 
	}

    isCloseTo (v, tolerance) {	
		if(this.equals(v)) return true;
		
		Vector2Const.temp.copyFrom(this); 
		Vector2Const.temp.minusEq(v); 
		
		return(Vector2Const.temp.magnitudeSquared() < tolerance*tolerance);
	}
	
	rotateAroundPoint(point, angle, useRadians) {
		Vector2Const.temp.copyFrom(this); 
		//trace("rotate around point "+t+" "+point+" " +angle);
		Vector2Const.temp.minusEq(point);
		//trace("after subtract "+t);
		Vector2Const.temp.rotate(angle, useRadians);
		//trace("after rotate "+t);
		Vector2Const.temp.plusEq(point);
		//trace("after add "+t);
		this.copyFrom(Vector2Const.temp);
		
	}
}
