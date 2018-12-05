// @flow
/* eslint-disable react/no-danger */
import React from 'react';
import Helmet from 'react-helmet';

type PropsT = {
    children: *,
    css: string[],
    scripts: string[],
    state: string,
};

export default class HTML extends React.Component<PropsT> {
    static defaultProps = {
        css: [],
        scripts: [],
        state: '{}',
    };

    render() {
        const head = Helmet.renderStatic();
        const { children, scripts, css, state } = this.props;
        return (
            <html lang="en">
                <head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="description" content="SJSU Project : Cashierless store" />
                    <meta name="keywords" content="HTML,CSS,JavaScript,SJSU,Cashierless,CMPE280" />
                    <meta name="author" content="SJSU Team" />
                    <link rel="manifest" href="/manifest.json" />
                    {head.base.toComponent()}
                    {head.title.toComponent()}
                    {head.meta.toComponent()}
                    {head.link.toComponent()}
                    {head.script.toComponent()}
                    {css.map((href) => {
                        return <link key={href} rel="stylesheet" href={href} />;
                    })}
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `window.__PRELOADED_STATE__ = ${state}`,
                        }}
                    />
                </head>
                <body>
                    <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
                    {scripts.map((src) => {
                        return <script key={src} src={src} />;
                    })}
                </body>
            </html>
        );
    }
}
