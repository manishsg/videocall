import * as React from 'react';
import {FontIcon, IconButton, OverflowSet, Persona, PersonaPresence, PersonaSize, Stack} from '@fluentui/react';
import {
    iconStyle,
    itemStyles,
    overFlowButtonStyles,
    participantStackStyle,
    participantStackTokens
} from './styles/ParticipantStack.styles';
import {Call, RemoteParticipant} from '@azure/communication-calling';
import {CallingApplicationKind, CommunicationUserKind} from '@azure/communication-common';
import {ParticipantStream} from 'core/reducers';
import {utils} from '../Utils/Utils';
import {MicIcon, MicOffIcon} from '@fluentui/react-icons-northstar';

export interface ParticipantStackProps {
    userId: string;
    displayName: string;
    call: Call;
    callState: string;
    screenShareStreams: ParticipantStream[];
    remoteParticipants: RemoteParticipant[];

    removeParticipant(user: CallingApplicationKind | CommunicationUserKind | undefined): void;
}

export interface CallParticipant {
    key: string;
    name: string;
    participant: RemoteParticipant | undefined;
    state: string;
    isScreenSharing: boolean;
    isSpeaking: boolean;
}

const onRenderItem = (item: any) => (
    <>
        <Persona
            text={item.name}
            styles={itemStyles}
            size={PersonaSize.size32}
            presence={item.state === 'Connected' ? PersonaPresence.online : PersonaPresence.offline}
        />
        {item.isSpeaking ? <MicIcon size="medium"/> : <MicOffIcon size="medium"/>}
        {item.isScreenSharing && <FontIcon className={iconStyle} iconName="ScreenCast"/>}
    </>
);
const onRenderOverflowButton = (overflowItems: any) => (
    <IconButton
        role="menuitem"
        title="More options"
        styles={overFlowButtonStyles}
        menuIconProps={{iconName: 'More'}}
        menuProps={{items: overflowItems}}
    />
);
const getParticipants = (
    participants: CallParticipant[],
    removeParticipant: (user: CallingApplicationKind | CommunicationUserKind | undefined) => void
) =>
    participants.map((item, i) => (
        <OverflowSet
            key={i}
            items={[item]}
            role="menubar"
            vertical={false}
            onRenderOverflowButton={onRenderOverflowButton}
            onRenderItem={onRenderItem}
        />
    ));
export default (props: ParticipantStackProps): JSX.Element => {
    const activeScreenShareStream = props.screenShareStreams && props.screenShareStreams.length === 1;
    const screenShareStream = props.screenShareStreams[0];
    const participants: CallParticipant[] = props.remoteParticipants.map((participant) => {
        const isScreenSharing = activeScreenShareStream ? screenShareStream.user === participant : false;
        return {
            key: utils.getId(participant.identifier),
            name: participant.displayName ?? utils.getId(participant.identifier),
            participant: participant,
            state: participant.state,
            isScreenSharing: isScreenSharing,
            isSpeaking: participant.isSpeaking
        };
    });
    participants.push({
        key: `${props.userId} (You)`,
        name: `${props.displayName} (You)`,
        participant: undefined,
        state: 'Connected',
        isScreenSharing: activeScreenShareStream ? utils.getId(screenShareStream.user.identifier) === props.userId : false,
        isSpeaking: !props.call.isMicrophoneMuted
    });
    return (
        <Stack className={participantStackStyle} tokens={participantStackTokens}>
            {getParticipants(participants, props.removeParticipant)}
        </Stack>
    );
};
