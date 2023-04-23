import React from "react"
import {Icon, PrimaryButton, Separator, Stack, TextField} from '@fluentui/react';
import {
    copyIconStyle,
    copyLinkButtonStyle,
    footerMainTextStyle,
    paneFooterStyles,
    paneFooterTokens,
    textFieldStyles
} from "./styles/CommandPanel.styles"

const invitePeopleString = 'Invite people to join';
const copyJoinInfoString = 'Copy join info';

const copyJoinLink = () => {
    const inputElement = document.getElementById('inputText') as HTMLInputElement;
    inputElement.select();
    document.execCommand('copy');
};

export default () => {
    return <Stack styles={paneFooterStyles} tokens={paneFooterTokens}>
        <Separator/>
        <div className={footerMainTextStyle}>{invitePeopleString}</div>
        <TextField styles={textFieldStyles} id="inputText" type="text" value={`${document.baseURI}`}></TextField>
        <PrimaryButton className={copyLinkButtonStyle} onClick={copyJoinLink}>
            <Icon iconName="Copy" className={copyIconStyle}/>
            {copyJoinInfoString}
        </PrimaryButton>
    </Stack>
}
