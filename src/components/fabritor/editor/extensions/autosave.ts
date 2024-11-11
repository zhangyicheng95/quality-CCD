import { fabric } from 'fabric';
import Editor from '..';
import { LOAD_FROM_LOCAL_WHEN_INIT, AUTO_SAVE_WHEN_CHANGE } from '@/common/constants/globalConstants';

export default class AutoSave {
  private canvas: fabric.Canvas;
  private editor: Editor;
  private saving: boolean;
  private canSave: boolean;

  constructor(editor: any) {
    this.canvas = editor.canvas;
    this.editor = editor;

    this.saving = false;
    this.canSave = true;

    this.init();
  }

  private init() {
    if (AUTO_SAVE_WHEN_CHANGE) {
      // @ts-ignore
      this.canvas?.on?.(this.initAutoSaveEvents());
    }
  }

  public dispose() {
    if (AUTO_SAVE_WHEN_CHANGE) {
      this.canvas.off(this.initAutoSaveEvents());
    }
  }

  public setCanSave(can: any) {
    this.canSave = can;
  }

  private autoSaveAction() {
    if (this.saving) return;
    this.saving = true;

    try {
      if (this.canSave) {
        // localStorage.setItem('fabritor_web_json', this._getJSON());
      }
    } catch (e) { console.log(e) }

    this.saving = false;
  }

  private _getJSON() {
    const json: any = this.editor.canvas2Json();
    const result = {
      ...json,
      objects: (json.objects || [])?.filter((i: any) => i.id !== "fabritor-sketch")
    }
    return JSON.stringify(result);
  }

  private initAutoSaveEvents() {
    return {
      'object:added': this.autoSaveAction.bind(this),
      'object:removed': this.autoSaveAction.bind(this),
      'object:modified': this.autoSaveAction.bind(this),
      'object:skewing': this.autoSaveAction.bind(this),
      'fabritor:object:modified': this.autoSaveAction.bind(this)
    };
  }

  public async loadFromLocal() {
    if (LOAD_FROM_LOCAL_WHEN_INIT) {
      try {
        const jsonStr = localStorage.getItem('fabritor_web_json')
        if (jsonStr) {
          const json = JSON.parse(jsonStr);
          await this.editor.loadFromJSON(json);
        }
      } catch (e) { console.log(e) }
    }
  }
}