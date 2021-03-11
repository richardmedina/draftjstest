import React from 'react'
import { EditorState, convertToRaw } from 'draft-js'
import Editor from 'draft-js-plugins-editor'

import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import "draft-js-mention-plugin/lib/plugin.css";

import mentions from './mentions'
import styles from './styles.module.css'

class TextInput extends React.Component {

  constructor(props){
    super(props)

    this.mentionPlugin = createMentionPlugin()
  }

  state = {
    editorState: EditorState.createEmpty(),
    suggestions: mentions
  }

  onChange = editorState => {
    this.setState({ editorState })
  }

  onSearchChange = ({ value }) => {
    console.log('onSearchChange: ', value)
    this.setState ({
      suggestions: defaultSuggestionsFilter(value, mentions)
    })
  }

  handleExtractData = evt => {
    const contentState = this.state.editorState.getCurrentContent()
    const raw = convertToRaw(contentState)

    console.log('Raw content: ', raw)
  }

  handleExtractMentions = evt => {
    const contentState = this.state.editorState.getCurrentContent()
    const raw = convertToRaw(contentState)

    let mentionedUsers = []

    for (let key in raw.entityMap){
      const entity = raw.entityMap[key]
      mentionedUsers.push(entity.data.mention)
    }

    console.log('Mentioned Users: ', mentionedUsers)
  }

  render(){
    const { MentionSuggestions } = this.mentionPlugin
    const plugins = [this.mentionPlugin]

    return (
      <div>
        <div className={styles.editor}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
          />
          <MentionSuggestions
            onSearchChange={this.onSearchChange}
            suggestions={this.state.suggestions}
          />
        </div>
        <div>
          <button onClick={this.handleExtractData}>Extract data</button>
          <button onClick={this.handleExtractMentions}>Extract mentions</button>
        </div>
      </div>
    )   
  }
}

export default TextInput
