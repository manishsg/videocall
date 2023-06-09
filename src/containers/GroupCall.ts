import {connect} from 'react-redux';
import GroupCall, {GroupCallProps} from '../components/GroupCall';
import {joinGroup, setMicrophone} from '../core/sideEffects';
import {setLocalVideoStream} from '../core/actions/streams';
import {setAudioDeviceInfo, setVideoDeviceInfo} from '../core/actions/devices';
import {AudioDeviceInfo, LocalVideoStream, VideoDeviceInfo} from '@azure/communication-calling';
import {State} from '../core/reducers';
import {callRetried} from 'core/actions/calls';

const mapStateToProps = (state: State, props: GroupCallProps) => ({
    userId: state.sdk.userId,
    callAgent: state.calls.callAgent,
    deviceManager: state.devices.deviceManager,
    group: state.calls.group,
    screenWidth: props.screenWidth,
    call: state.calls.call,
    shareScreen: state.controls.shareScreen,
    mic: state.controls.mic,
    groupCallEndReason: state.calls.groupCallEndReason,
    isGroup: () => state.calls.call && state.calls.call.direction !== 'Incoming' && !!state.calls.group,
    joinGroup: async () => {
        state.calls.callAgent &&

        await joinGroup(
            state.calls.callAgent,
            {
                groupId: state.calls.group
            },
            {
                videoOptions: {localVideoStreams: state.streams.localVideoStream ? [state.streams.localVideoStream] : undefined},
                audioOptions: {muted: !state.controls.mic}
            }
        );
    },
    remoteParticipants: state.calls.remoteParticipants,
    streams: state.streams.streams,
    callState: state.calls.callState,
    localVideo: state.controls.localVideo,
    localVideoStream: state.streams.localVideoStream,
    screenShareStreams: state.streams.screenShareStreams,
    videoDeviceInfo: state.devices.videoDeviceInfo,
    audioDeviceInfo: state.devices.audioDeviceInfo,
    videoDeviceList: state.devices.videoDeviceList,
    audioDeviceList: state.devices.audioDeviceList,
    cameraPermission: state.devices.cameraPermission,
    microphonePermission: state.devices.microphonePermission,
    attempts: state.calls.attempts
});

const mapDispatchToProps = (dispatch: any) => ({
    mute: () => dispatch(setMicrophone(false)),
    setAudioDeviceInfo: (deviceInfo: AudioDeviceInfo) => {
        dispatch(setAudioDeviceInfo(deviceInfo));
    },
    setVideoDeviceInfo: (deviceInfo: VideoDeviceInfo) => {
        dispatch(setVideoDeviceInfo(deviceInfo));
    },
    setLocalVideoStream: (localVideoStream: LocalVideoStream) => dispatch(setLocalVideoStream(localVideoStream)),
    setAttempts: (attempts: number) => dispatch(callRetried(attempts)),
});

const connector: any = connect(mapStateToProps, mapDispatchToProps);
export default connector(GroupCall);
