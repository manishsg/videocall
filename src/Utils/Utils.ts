// © Microsoft Corporation. All rights reserved.
import {AudioDeviceInfo, RemoteVideoStream, VideoDeviceInfo} from '@azure/communication-calling';
import {CommunicationIdentifierKind} from '@azure/communication-common';
import {CommunicationUserToken} from '@azure/communication-identity';
import preval from 'preval.macro';

export const utils = {
    getAppServiceUrl: (): string => {
        return window.location.origin;
    },
    getTokenForUser: async (): Promise<CommunicationUserToken> => {
        const response = await fetch('https://devfirst5.persimmony.com/api/Communication/userToken');
        if (response.ok) {
            return response.json();
        }
        throw new Error('Invalid token response');
    },
    isSelectedAudioDeviceInList(selected: AudioDeviceInfo, list: AudioDeviceInfo[]): boolean {
        return list.filter((item) => item.name === selected.name).length > 0;
    },
    isSelectedVideoDeviceInList(selected: VideoDeviceInfo, list: VideoDeviceInfo[]): boolean {
        return list.filter((item) => item.name === selected.name).length > 0;
    },
    isMobileSession(): boolean {
        return window.navigator.userAgent.match(/(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone)/g)
            ? true
            : false;
    },
    isSmallScreen(): boolean {
        return window.innerWidth < 700 || window.innerHeight < 400;
    },
    isUnsupportedBrowser(): boolean {
        return window.navigator.userAgent.match(/(Firefox)/g) ? true : false;
    },
    getId: (identifier: CommunicationIdentifierKind): string => {
        switch (identifier.kind) {
            case 'communicationUser':
                return identifier.communicationUserId;
            case 'callingApplication':
                return identifier.callingApplicationId;
            case 'phoneNumber':
                return identifier.phoneNumber;
            case 'microsoftTeamsUser':
                return identifier.microsoftTeamsUserId;
            case 'unknown':
                return identifier.id;
        }
    },
    getStreamId: (userId: string, stream: RemoteVideoStream): string => {
        return `${userId}-${stream.id}-${stream.mediaStreamType}`;
    },
    /*
     * TODO:
     *  Remove this method once the SDK improves error handling for unsupported browser.
     */
    isOnIphoneAndNotSafari(): boolean {
        const userAgent = navigator.userAgent;
        // Chrome uses 'CriOS' in user agent string and Firefox uses 'FxiOS' in user agent string.
        if (userAgent.includes('iPhone') && (userAgent.includes('FxiOS') || userAgent.includes('CriOS'))) {
            return true;
        }
        return false;
    },
    getBuildTime: (): string => {
        const dateTimeStamp = preval`module.exports = new Date().toLocaleString();`;
        return dateTimeStamp;
    }
};
