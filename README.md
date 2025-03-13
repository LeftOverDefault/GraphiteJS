# JGame

JGame is a JavaScript game development library inspired by the popular Python library, Pygame. It provides a simple and intuitive API for creating 2D games.

## Features

- **Vector Math**: Includes a `Vector2` class for 2D vector operations.
- **Color Handling**: Provides a `Color` class for color manipulation and predefined colors.
- **Canvas Management**: Simplifies canvas setup and drawing operations.
- **Transformations**: Basic support for transformations (to be expanded).
- **Input Handling**: Placeholder for mouse and keyboard input handling (to be implemented).

## Getting Started

### Installation

Clone the repository to your local machine:

```sh
git clone https://github.com/yourusername/jgame.git
```

### Usage

Include the `main.js` file in your HTML:

```html
<script src="path/to/main.js"></script>
```

Initialize the JGame library and set up the canvas:

```javascript
const jg = new jgame();
const canvas = document.getElementById('gameCanvas');
jg.setCanvas(canvas);
```

### Example

Create a vector and log its properties:

```javascript
let vector2 = new jg.math.Vector2(100, 100);
console.log(vector2);
```

## Documentation

### Vector2 Class

- **constructor(x, y)**: Creates a new vector with the given x and y coordinates.
- **clone()**: Returns a copy of the vector.
- **magnitude()**: Returns the magnitude (length) of the vector.
- **normalize()**: Normalizes the vector to a unit vector.
- **dot(v)**: Returns the dot product of the vector with another vector `v`.
- **angle(useRadians)**: Returns the angle of the vector.
- **rotate(angle, useRadians)**: Rotates the vector by the given angle.
- **isCloseTo(v, tolerance)**: Checks if the vector is close to another vector `v` within a given tolerance.
- **rotateAroundPoint(point, angle, useRadians)**: Rotates the vector around a given point.

### Color Class

- **constructor(r, g, b, a)**: Creates a new color with the given RGBA values.
- **constructor(hex, a)**: Creates a new color from a hex string and optional alpha value.
- **clone()**: Returns a copy of the color.
- **toHexA()**: Returns the color as a hex string with alpha.
- **toHex()**: Returns the color as a hex string.
- **toRGBA()**: Returns the color as an RGBA string.
- **toRGB()**: Returns the color as an RGB string.
- **toHSLA()**: Returns the color as an HSLA string.
- **toHSL()**: Returns the color as an HSL string.
- **equals(color)**: Checks if the color is equal to another color.
- **add(color)**: Adds another color to this color.
- **minus(color)**: Subtracts another color from this color.
- **multiply(color)**: Multiplies this color by another color.
- **divide(color)**: Divides this color by another color.
- **multiply(scalar)**: Multiplies this color by a scalar.
- **divide(scalar)**: Divides this color by a scalar.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Inspired by [Pygame](https://www.pygame.org/), a popular game development library for Python.
