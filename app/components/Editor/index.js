/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import { Editor, Html } from 'slate';
import { insertParagraph, getPlugins, getSchema } from './utils';
import rules from './serializer';
import Toolbar from './Toolbar';
import Tooltip from './Tooltip';
import styles from './Editor.css';
import { Blocks } from './constants';


const html = new Html({ rules });

export type Props = {
  content?: string,
  uploadFile?: (Object) => void,
  simple?: boolean,
  autoFocus?: boolean,
  placeholder?: string,
  onChange?: func,
  onFocus?: func,
  onBlur?: func,
  disableBlocks: boolean
};

export default class CustomEditor extends Component {

  props: Props;

  state = {
    editorState: html.deserialize(this.content || '<p></p>'),
    focus: false
  };

  wrapperElement = undefined;

  onChange = (editorState) => {
    const hasFocus = !editorState.isBlurred;
    let focus = this.state.focus;

    if (hasFocus && !focus) {
      this.onFocus();
      focus = true;
    } else if (!hasFocus && focus) {
      this.onBlur();
      focus = false;
    }

    this.setState({ editorState, focus });
  }

  onFocus = () => {
    this.props.onFocus();
  }

  onBlur = () => {
    this.props.onBlur();
  }

  onDocumentChange = (document, state) => {
    const content = html.serialize(state);
    this.props.onChange(content);

    if (state.isCollapsed && state.startBlock.isVoid) {
      const transformed = insertParagraph(state);
      this.onChange(transformed);
    }
  }

  insertBlock = (properties) => {
    if (this.props.disableBlocks) {
      return;
    }
    const transformed = insertParagraph(
      this.state.editorState
        .transform()
        .setBlock(properties)
        .collapseToStartOfNextBlock()
        .apply({
          save: false
        })
    );

    this.onChange(transformed);
  }

  hasBlock = (type) => {
    const { editorState } = this.state;
    return editorState.blocks.some((node) => node.type === type);
  }

  setBlockType = (type) => {
    if (this.props.disableBlocks) {
      return;
    }
    const { editorState } = this.state;
    const transfrom = editorState.transform();
    const isActive = this.hasBlock(type);
    const isList = this.hasBlock(Blocks.LI);

    if (type !== Blocks.OL && type !== Blocks.UL) {
      if (isList) {
        transfrom
          .setBlock(isActive ? Blocks.Paragraph : type)
          .unwrapBlock(Blocks.UL)
          .unwrapBlock(Blocks.OL);
      } else {
        transfrom.setBlock(isActive ? Blocks.Paragraph : type);
      }
    } else {
      const isType = editorState.blocks
        .some((block) => !!editorState.document.getClosest(block.key, (par) => par.type === type));

      if (isList && isType) {
        transfrom
            .setBlock(Blocks.Paragraph)
            .unwrapBlock(Blocks.UL)
            .unwrapBlock(Blocks.OL);
      } else if (isList) {
        transfrom
          .unwrapBlock(type === Blocks.UL ? Blocks.OL : Blocks.UL)
          .wrapBlock(type);
      } else {
        transfrom
          .setBlock(Blocks.LI)
          .wrapBlock(type);
      }
    }

    this.onChange(transfrom.apply({ save: false }));
  }

  setInlineStyle = (type) => {
    const { editorState } = this.state;

    const transformed = editorState
      .transform()
      .toggleMark(type)
      .apply({ save: false });

    this.onChange(transformed);
  }

  render = () => {
    const { editorState } = this.state;
    return (
      <div
        ref={(c) => { this.wrapperElement = c; }}
        className={styles.EditorWrapper}
      >
        <Editor
          state={editorState}
          placeholder={this.props.placeholder || 'Default placeholder'}
          onChange={this.onChange}
          plugins={getPlugins(!this.props.disableBlocks)}
          schema={getSchema(!this.props.disableBlocks)}
          onDocumentChange={this.onDocumentChange}
          className={styles.Editor}
        />

        {
          !this.props.disableBlocks &&
          <Toolbar
            editorState={editorState}
            insertBlock={this.insertBlock}
            wrapperElement={this.wrapperElement}
          />
        }

        <Tooltip
          disableBlocks={this.props.disableBlocks}
          setBlockType={this.setBlockType}
          setInlineStyle={this.setInlineStyle}
          editorState={editorState}
          wrapperElement={this.wrapperElement}
        />

      </div>
    );
  }
}