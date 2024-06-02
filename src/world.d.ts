import { Application, Container } from "pixi.js";

export interface GameWorld {
    app: Application;
    mainCharacter: MainCharacter;
}

export interface MainCharacter {
    container: Container;
    
}