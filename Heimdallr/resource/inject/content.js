function initInject() {
    const OriginalToBlob = HTMLCanvasElement.prototype.toBlob
    const OriginalToDataURL = HTMLCanvasElement.prototype.toDataURL
    const OriginalGetImageData = CanvasRenderingContext2D.prototype.getImageData

    const randomRGBA = {
        'r': Math.floor(Math.random() * 255),
        'g': Math.floor(Math.random() * 255),
        'b': Math.floor(Math.random() * 255),
        'a': Math.floor(Math.random() * 255) 
    }

    var interfere = function (canvaselement, context2d) {
        if (context2d) {
            const width = canvaselement.width;
            const height = canvaselement.height;

            if (width && height) {
                // [左顶点横坐标，左顶点纵坐标，矩形宽度，矩形高度]
                const imageData = OriginalGetImageData.apply(context2d, [0, 0, width, height]);
                for (let i = 0; i < height; i++) {
                    for (let j = 0; j < width; j++) {
                        // rgba(255,255,255,1) [255.255.255.255]
                        const n = ((i * (width * 4)) + (j * 4));
                        imageData.data[n + 0] = ((imageData.data[n + 0] + randomRGBA.r)>=255)?(imageData.data[n + 0] + randomRGBA.r - 255):(imageData.data[n + 0] + randomRGBA.r)
                        imageData.data[n + 1] = ((imageData.data[n + 1] + randomRGBA.g)>=255)?(imageData.data[n + 1] + randomRGBA.r - 255):(imageData.data[n + 1] + randomRGBA.r)
                        imageData.data[n + 2] = ((imageData.data[n + 2] + randomRGBA.b)>=255)?(imageData.data[n + 2] + randomRGBA.r - 255):(imageData.data[n + 2] + randomRGBA.r)
                        imageData.data[n + 3] = ((imageData.data[n + 3] + randomRGBA.a)>=255)?(imageData.data[n + 3] + randomRGBA.r - 255):(imageData.data[n + 3] + randomRGBA.r)
                    }
                }
                // (要放回画布的 ImageData 对象,左顶点横坐标,左顶点纵坐标)
                context2d.putImageData(imageData, 0, 0);
            }
        }
    }

    // HTMLCanvasElement toBlob
    Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {"value": function () {
        interfere(this, this.getContext("2d"));
        return OriginalToBlob.apply(this, arguments);
        }
    })
    Object.defineProperty(HTMLCanvasElement.prototype.toBlob, "length", {"value": 1});
    Object.defineProperty(HTMLCanvasElement.prototype.toBlob, "toString", {"value": () => "function toBlob() { [native code] }"});
    Object.defineProperty(HTMLCanvasElement.prototype.toBlob, "name", {"value": "toBlob"});
    
    // HTMLCanvasElement toDataURL
    Object.defineProperty(HTMLCanvasElement.prototype, "toDataURL", {"value": function () {
        interfere(this, this.getContext("2d"));
        return OriginalToDataURL.apply(this, arguments);
        }
    })
    Object.defineProperty(HTMLCanvasElement.prototype.toDataURL, "length", {"value": 0})
    Object.defineProperty(HTMLCanvasElement.prototype.toDataURL, "toString", {"value": () => "function toDataURL() { [native code] }"})
    Object.defineProperty(HTMLCanvasElement.prototype.toDataURL, "name", {"value": "toDataURL"})


    // CanvasRenderingContext2D getImageData
    Object.defineProperty(CanvasRenderingContext2D.prototype, "getImageData", {"value": function () {
        interfere(this.canvas, this);
        return OriginalGetImageData.apply(this, arguments)
        }
    })
    Object.defineProperty(CanvasRenderingContext2D.prototype.getImageData, "length", {"value": 4})
    Object.defineProperty(CanvasRenderingContext2D.prototype.getImageData, "toString", {"value": () => "function getImageData() { [native code] }"})
    Object.defineProperty(CanvasRenderingContext2D.prototype.getImageData, "name", {"value": "getImageData"})
}


initInject()
