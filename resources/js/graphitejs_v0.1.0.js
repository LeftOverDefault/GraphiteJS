//===============================================================================================================//
//
//   GraphiteJS - JavaScript Game Library
//
//   GraphiteJS is a JavaScript game development library inspired by the popular Python library Pygame.
//   It is meant as an aid for creating games in JavaScript. It makes use of pre-existing JavaScript features,
//   and is not meant as an all in one solution. Besides, the only reason you should be making games in
//   JavaScript is so you can play it on the web. This is not meant for full-scale projects.
//
//   ------------
//
//   This library is free software; you can redistribute it and/or
//   modify it under the terms of the GNU Library General Public
//   License as published by the Free Software Foundation; either
//   version 2 of the License, or (at your option) any later version.
//
//   ------------
//
//   Copyright (c) 2025 Michael Goddard (LeftOverDefault)
//
//===============================================================================================================//


//========//
//  MATH  //
//========//


//===========//
//  SURFACE  //
//===========//


//========//
//  RECT  //
//========//


//=============//
//  TRANSFORM  //
//=============//


//=========//
//  MOUSE  //
//=========//


//============//
//  KEYBOARD  //
//============//


//=========//
//  AUDIO  //
//=========//


//==========//
//  NETWORK //
//==========/


class Framework {
  constructor() {
    this._canvas = {};
    this._context = {};
  }

  init() {
    this.update = (callback) => { requestAnimationFrame(callback) };
    this.math = {}
    this.surface = {}
    this.rect = {}
    this.transform = {}
    this.mouse = {}
    this.keyboard = {}
    this.audio = {}
    this.network = {}
  }

  setCanvas(canvas, size = { width: 1920, height: 1080 }) {
    this._canvas = canvas;
    this._context = this._canvas.getContext("2d");

    this._canvas.width = size.width;
    this._canvas.height = size.height;
  }

  getCanvas() {
    return this._canvas;
  }

  getContext() {
    return this._context;
  }
}


const framework = new Framework();

window.graphitejs = framework;
