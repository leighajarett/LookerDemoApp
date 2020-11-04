import React, { useState, useContext, useEffect } from "react"
import { Grid, Badge, Heading, Box, Icon, Paragraph, IconButton, Space,Tooltip, Text, MessageBar, MenuGroup, MenuList, MenuItem, Card, CardContent, CardMedia } from '@looker/components'
import { useParams } from "react-router-dom";
import { DateFormat } from '@looker/components/lib/DateFormat'
import ReactPlayer from "react-player"
import {
    ExtensionContext,
    ExtensionContextData,
    getCore40SDK,
  } from '@looker/extension-sdk-react'

export default function LookerTile(props:any){
    const [title, setTitle] = useState<string | undefined>(undefined);
    const [id, setId] = useState<any | undefined>(undefined);
    const [link, setLink] = useState<string | undefined>(undefined);
    const [svg, setSvg] = useState<any | undefined>(undefined);
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
    const sdk = extensionContext.core40SDK
    const extensionHost = extensionContext.extensionSDK
    
    // get the information about the dashboard from its slug
    useEffect(() => {
        const dashboard = async () => {
            try {
                const dash = await sdk.ok(sdk.dashboard(props.dashboard_slug));
                if(dash){
                    setTitle(dash.title || '');
                    setId(dash.id || '');
                    if(props.is_overview){
                        props.setViews(dash.view_count);
                        props.setFavorites(dash.favorite_count);
                        props.setContentMetaId(dash.content_metadata_id);
                        props.setOverviewTitle(dash.title || '');
                        if(dash.content_favorite_id){
                            props.setfavoriteContentId(dash.content_favorite_id);
                            props.setFavorite(true);
                        }
                    }
                }
            }catch(err){
                console.log('Problem retrieving the dashboard ', err)
            }
        }
        dashboard();
    } ,[props.dashboard_slug, props.isFavorite])


    // / get content thumbnail
    useEffect(() => {
        if(props.type === 'extension'){setLink('/extensions/'+props.extension_id)}
        if(id && (props.type ==='dashboard' || props.type === 'look')){
            if(props.type === 'dashboard'){setLink('/dashboards-next/'+props.dashboard_slug)}
            else if(props.type === 'look'){setLink('/looks/'+props.look_slug)}
            const getThumbnail = async () => {
                try{
                    const thumbnailResponse = await sdk.ok(sdk.content_thumbnail({type:props.type,resource_id: id }))
                    const blob = new Blob([thumbnailResponse], { type: 'image/svg+xml' });
                    let url = URL.createObjectURL(blob);
                    setSvg(url);
                }catch(err){
                    console.log('Problem getting thumbnail ', err)
                }
            }
            getThumbnail()
        }
    } ,[id, props.type])

    return(
        <>
        {link ?  
            <Card maxWidth="10rem" maxHeight="11rem" onClick={() => extensionHost.openBrowserWindow(link,'_blank')}raised>
                <CardMedia
                    image={svg}
                />
                <CardContent>
                    <Text
                        fontSize="xxsmall"
                        textTransform="uppercase"
                        fontWeight="semiBold"
                        variant="subdued"
                    >
                    {props.type}
                </Text>
                <Heading as="h4" fontSize="small" fontWeight="semiBold" truncate>
                    {title}
                </Heading>
                </CardContent>
            </Card>   
        : <></>}
        </>
    )
 }