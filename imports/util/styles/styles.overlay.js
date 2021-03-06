
import collectionClass from "../collections/collections.class";
import collectionColor from "../collections/collections.color";

const hexToRGB = (hex) => {
    hex = parseInt(hex, 16);
    let r = hex >> 16;
    let g = hex >> 8 & 0xFF;
    let b = hex & 0xFF;
    return [r, g, b];
};

// TODO: can we do this better with CSS modules?
// no support for inline styles for pseudo elements
function overlayStyles(contentItem) {
  const rgba = hexToRGB(collectionColor(contentItem)).join(", ");
  return `
    .${collectionClass(contentItem)}:after{
      background: linear-gradient(to bottom, rgba(${rgba}, 0) 0%, #${collectionColor(contentItem)} 100%);
    }
  `;
}

export default overlayStyles;
