// © Microsoft Corporation. All rights reserved.

import React, {useEffect, useState} from 'react';
import {Image, ImageFit, Label} from '@fluentui/react';
import {LocalVideoStream, Renderer, RendererView} from '@azure/communication-calling';
import {localVideoContainerStyle, mediaContainer, videoHint} from './styles/StreamMedia.styles';
import {Constants} from '../core/constants';
import staticMediaSVG from '../assets/staticmedia.svg';

export interface LocalStreamMediaProps {
    label: string;
    stream: LocalVideoStream;
}

export default (props: LocalStreamMediaProps): JSX.Element => {
    let rendererView: RendererView;

    const [activeStreamBeingRendered, setActiveStreamBeingRendered] = useState(false);

    const imageProps = {
        src: staticMediaSVG.toString(),
        imageFit: ImageFit.contain,
        styles: {
            root: {
                width: '100%',
                height: '100%'
            }
        }
    };

    const {stream, label} = props;

    useEffect(() => {
        (async () => {
            if (stream) {
                const renderer: Renderer = new Renderer(stream);
                rendererView = await renderer.createView({scalingMode: 'Crop', isMirrored: true});

                const container = document.getElementById(Constants.LOCAL_VIDEO_PREVIEW_ID);

                if (container && container.childElementCount === 0) {
                    container.appendChild(rendererView.target);
                    setActiveStreamBeingRendered(true);
                }
            } else {
                if (rendererView) {
                    rendererView.dispose();
                    setActiveStreamBeingRendered(false);
                }
            }
        })();

        return () => {
            if (rendererView) {
                rendererView.dispose();
                setActiveStreamBeingRendered(false);
            }
        };
    }, [stream]);

    return (
        <div className={mediaContainer}>
            <div
                style={{display: activeStreamBeingRendered ? 'block' : 'none'}}
                className={localVideoContainerStyle}
                id={Constants.LOCAL_VIDEO_PREVIEW_ID}
            />
            <Image {...imageProps} style={{display: activeStreamBeingRendered ? 'none' : 'block'}}/>
            <Label className={videoHint}>{label}</Label>
        </div>
    );
};
