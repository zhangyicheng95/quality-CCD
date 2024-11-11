import { fabric } from 'fabric';
import AppSubPanel from './AppSubPanel';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useContext, useEffect, useState } from 'react';
import { GloablStateContext } from '@/context';
import { createTextbox } from '@/components/fabritor/editor/objects/textbox';

export default function EmojiPanel(props: any) {
  const { back } = props;
  const { editor } = useContext<any>(GloablStateContext);
  const [emojiLocale, setEmojiLocale] = useState('zh');

  const handleEmojiSelect = async (emoji: any) => {
    const object = editor.canvas.getActiveObject() as fabric.Textbox;
    if (object && object.type === 'textbox') {
      object.set('text', `${object.text}${emoji.native}`);
      editor.canvas.requestRenderAll();
    } else {
      await createTextbox({
        text: emoji.native,
        fontSize: 80,
        width: 100,
        canvas: editor.canvas
      });
    }
  }

  return (
    <AppSubPanel title="Emoji" back={back}>
      <Picker
        data={data}
        perLine={8}
        set="native"
        locale={emojiLocale}
        emojiButtonSize={30}
        emojiSize={22}
        onEmojiSelect={handleEmojiSelect}
      />
    </AppSubPanel>
  )
}