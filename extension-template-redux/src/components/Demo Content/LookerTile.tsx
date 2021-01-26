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
    const [title, setTitle] = useState<string | undefined>(props.name);
    const [id, setId] = useState<any | undefined>(undefined);
    const [link, setLink] = useState<string | undefined>(undefined);
    const [svg, setSvg] = useState<any | undefined>(undefined);
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
    const sdk = extensionContext.core40SDK
    const extensionHost = extensionContext.extensionSDK

    console.log('looker tile props', props, title, id, link, svg )
    
    // get the information about the dashboard from its slug
    useEffect(() => {
        const dashboard = async (id:string) => {
            try {
                const dash = await sdk.ok(sdk.dashboard(id));
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
        if(props.type == 'dashboard' && props.slug){dashboard(props.slug);}
    } ,[props.slug, props.isFavorite])


    // / get content thumbnail and set the links for where the tiles go
    useEffect(() => {
        const getThumbnail = async (content_type:string, content_id:string) => {
            try{
                const thumbnailResponse = await sdk.ok(sdk.content_thumbnail({type:content_type,resource_id: content_id }))
                const blob = new Blob([thumbnailResponse], { type: 'image/svg+xml' });
                let url = URL.createObjectURL(blob);
                setSvg(url);
            }catch(err){
                console.log('Problem getting thumbnail ', err)
            }
        }
        // if its verified, send the links to this instance, otherwise links go to the development instance
        if(props.verified){
            if(props.type === 'extension'){
                setLink('/extensions/'+props.id)
                getThumbnail('dashboard','1')
            }
            if(id && (props.type ==='dashboard' || props.type === 'look')){
                if(props.type === 'dashboard'){setLink('/dashboards-next/'+props.slug)}
                else if(props.type === 'look'){setLink('/looks/'+props.slug)}
                getThumbnail(props.type,id)
            }
        }
        else{
            if(props.id && props.dev_instance){
                if(props.type === 'extension'){setLink(props.dev_instance+'/extensions/'+props.id)}
                else if(props.type === 'dashboard'){setLink(props.dev_instance+'/dashboards-next/'+props.id)}
                else if(props.type === 'look'){setLink(props.dev_instance+'/looks/'+props.id)}
            }
            getThumbnail('dashboard','1')
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