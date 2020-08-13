"use strict";

// aspect ratio code by asplosions

const Discord = require("discord.js");
const Canvas = require("canvas");

const smallEmoteSize = 22; // 22x22
const largeEmoteSize = 48; // 48x48
const padding = 5;
const outputRatio = 1;

const emotePreview = async function(imageLink) {
    try {
        const image = await Canvas.loadImage(imageLink);
        // let's store the width and height of our image
        const inputWidth = image.naturalWidth; // Example: 200
        const inputHeight = image.naturalHeight; // Example: 100
        const inputRatio = inputWidth / inputHeight; // Example: 2
        
        let outputWidthSmall = smallEmoteSize;
        let outputHeightSmall = smallEmoteSize;
        let outputWidthLarge = largeEmoteSize;
        let outputHeightLarge = largeEmoteSize;

        if (inputRatio < outputRatio) { // Too narrow. Example: false
            outputWidthSmall = outputHeightSmall * inputRatio / outputRatio;
            outputWidthLarge = outputHeightLarge * inputRatio / outputRatio;
        } else if (inputRatio > outputRatio) { // Too wide. Example: true
            outputHeightSmall = outputWidthSmall / inputRatio * outputRatio; // Example: 22 / 2 = 11
            outputHeightLarge = outputWidthLarge / inputRatio * outputRatio; // Example: 48 / 2 = 24
        }

        const canvas = Canvas.createCanvas(outputWidthLarge + padding + outputWidthSmall, outputHeightLarge); // Create canvas to emote max pixel size
        const context = canvas.getContext("2d");

        context.drawImage(image, 0, 0, outputWidthLarge, outputHeightLarge);
        context.drawImage(image, outputWidthLarge + padding, Math.round(outputHeightSmall/2), outputWidthSmall, outputHeightSmall);
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "emote-preview.png");

        return attachment;

    } catch (e) {
        console.log(`Error with provided image link: `, e);
    }
};

module.exports = emotePreview;