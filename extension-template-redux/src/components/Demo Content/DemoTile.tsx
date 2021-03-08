import { Badge, Heading, Box, Icon, Paragraph, IconButton, Space,Tooltip, Text, MessageBar, Card, CardMedia, CardContent } from '@looker/components'
import React, { useState, useContext, useEffect } from "react"
import styled from 'styled-components'
import {
    ExtensionContext,
    ExtensionContextData,
    getCore40SDK,
  } from '@looker/extension-sdk-react'
import { StringIterator, String } from 'lodash'
import { createCipher } from 'crypto'
import { type } from 'os'
import { exception } from 'console'
import { useHistory } from 'react-router-dom'

interface DemoTileProps {
    id: string,
    name: string,
    description: string,
    overview_dashboard_slug?:string,
    verified:string,
    vertical:string,
    horizontal:string,
    new_banner:any,
    favoriteDemos:any,
    setFavorites:any, 
    firebase:any
}    

export default function DemoTile(props: DemoTileProps){
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
    const sdk = extensionContext.core40SDK
    const [favorite,setFavorite] = useState(false)
    // the title for the overview dashboard
    const [overviewTitle, setOverviewTitle] = useState<string | undefined>('')
    // the id for the overview dashboard
    const [overviewId, setOverviewId] = useState<string | undefined>('')
    // the content favorite id for the overview dashboard if its favorited
    const [favoriteContentId, setfavoriteContentId] = useState<number | undefined>(undefined)
    // the content metadata id for the overview dashboard 
    const [contentMetaId, setContentMetaId] = useState<number | undefined>(undefined)
    // Count of favorites for the overview dashboard
    const [countFavorites, setCountFavorites] = useState<number | undefined>(undefined)
    // Count of views for the overview dashboard
    const [countViews, setCountViews] = useState<number | undefined>(undefined)
    // Thumbnail SVG for the overview dashboard
    const [svg, setSvg] = useState<any>(undefined)

    var today = new Date().getTime() / 1000;
    const history = useHistory();

    console.log('id for ',props.name, overviewId)
    // get the information about the dashboard from its slug
    useEffect(() => {
        const dashboard = async (id:string) => {
            try {
                const dash = await sdk.ok(sdk.dashboard(id));
                if(dash){
                    setOverviewTitle(dash.title || '');
                    setOverviewId(dash.id || '');
                    setCountFavorites(dash.favorite_count);
                    setCountViews(dash.view_count);
                    setContentMetaId(dash.content_metadata_id);
                    if(dash.content_favorite_id){
                        setfavoriteContentId(dash.content_favorite_id);
                        setFavorite(true);
                    }
                }
            }catch(err){
                console.log('Problem retrieving the dashboard ', err)
            }
        }
        if(props.overview_dashboard_slug){dashboard(props.overview_dashboard_slug);}
    } ,[props.overview_dashboard_slug, favorite, props.favoriteDemos])


    // / get content thumbnail
    useEffect(() => {
        const getThumbnail = async (id:string) => {
            try{
                const thumbnailResponse = await sdk.ok(sdk.content_thumbnail({type:"dashboard",resource_id: id }))
                const blob = new Blob([thumbnailResponse], { type: 'image/svg+xml' });
                let url = URL.createObjectURL(blob);
                setSvg(url);
            }catch(err){
                console.log('Problem getting thumbnail ', err)
            }
        }
        if(overviewId){getThumbnail(overviewId)}
        else{
            console.log('getting thumbnail for unverified') 
            getThumbnail('1')}
    } ,[overviewId])
 

    // function to favorite a dashboard
    const favoriteDashboard = () => {
        if(contentMetaId){
            const favorite = async () => {
                try{
                    const response = await sdk.ok(sdk.create_content_favorite({'content_metadata_id':contentMetaId}));
                    setFavorite(true);
                    console.log('Finished Creating Favorite for Dashboard ', overviewId)
                }catch(err){
                    console.log('Problem Favoriting Dashboard ', err)
                }
            }
            favorite();
            // update the home page
            if(props.favoriteDemos && props.setFavorites){
                var newFavs = [];
                props.favoriteDemos.forEach( (val: any) => newFavs.push(Object.assign({}, val)))
                newFavs.push({...props});
                props.setFavorites(newFavs);
                console.log('making favorite from child - ', newFavs.slice())
            }
        }
        else{
            console.log('Cannot delete favorite - favorite ID has not been set')
        }
    };

    // // function to unfavorite a dashboard
    const unfavoriteDashboard = () => {
        if(favoriteContentId){
            const unFavorite = async () => {
                try{
                    const response = await sdk.ok(sdk.delete_content_favorite(favoriteContentId));
                    setFavorite(false);
                }catch(err){
                    console.log('Problem Favoriting Dashboard ', err)
                }
            }
            unFavorite();
            // update the home page
            if(props.favoriteDemos && props.setFavorites){
                let newFavs:any[]= [];
                props.favoriteDemos.forEach( (val: any) => 
                    {if(val.id !=props.id){newFavs.push(Object.assign({}, val))}})
                props.setFavorites(newFavs);
            }
        }
        else{
            console.log('Cannot delete favorite - favorite ID has not been set')
        }
    }

    // is true if the function should make the demo a favorite, false if it should unfavorite the demo
    const handleFavorite = (shouldFav: boolean) => {
        if(shouldFav){
            // favorite the overview dashboard
            favoriteDashboard();
        }
        else{
            // unfavorite the overview dashboard
            unfavoriteDashboard();
        }
    }

    // bring user to the detail page for the demo when they click on the image
    const handleImageClick = (demoId: string) => {
        history.push("/content/" + demoId);
    }

    return(
        <Box width="100%">
        <Box style={{float:"right"}} position="relative" minHeight="2em" minWidth="1rem">
            {today - props.new_banner.last_updated_at.seconds< 14*60*60*24 ? 
                // <Box display="flex" right="0" top="0" position="absolute" >
                    <Badge intent="inform">
                        New {props.new_banner.type}!
                    </Badge>
                    // </Box> 
                    : <></>}
        </Box>
        <Card style={{float:"right"}} position="relative" width="100%" height="22rem" onClick={() => handleImageClick(props.id)} raised>
            {/* only show a banner if new material has been added in the past 2 weeks */}
            {/* <StyledCardContent height="2.5rem">
                <Box position="relative" width="100%" >
                {today - props.new_banner.last_updated_at.seconds< 14*60*60*24 ? 
                    <Box display="flex" right="0" top="0" position="absolute" >
                    <Badge intent="inform">
                        New {props.new_banner.type}!
                    </Badge>
                    </Box> 
                    : <></>}
                </Box>
            </StyledCardContent> */}
            <CardMedia
                image={svg}
            />
            <CardContent flexGrow={1} position="relative" marginBottom=".75rem">
                <Box marginBottom=".75rem"  maxHeight="7rem" overflowY='auto'>
                    <Box display="flex" marginBottom="7"><Heading fontSize="medium" fontWeight="bold">{props.name}</Heading>
                        { favorite ? 
                            <Tooltip content={"Unfavorite All Demos with " + overviewTitle + " Dashboard"} width="10rem">
                                <IconButton label="Unfavorite" icon="Favorite" onClick={()=>handleFavorite(false)}/>
                            </Tooltip> 
                            : 
                            <>
                            { props.verified == 'True' ? 
                                <Tooltip content={"Favorite All Demos with "+ overviewTitle + " Dashboard"} width="10rem">
                                    <IconButton label="Favorite" icon="FavoriteOutline" onClick={()=>handleFavorite(true)} />  
                                </Tooltip> :
                                <Tooltip content={"Can't favorite unverified demos"+ overviewTitle + " Dashboard"} width="10rem">
                                    <IconButton label="Cant Favorite" icon="FavoriteOutline" disabled />
                                </Tooltip> }
                            </>
                        }
                    </Box>
                    <Paragraph fontSize='xsmall'>{props.description}</Paragraph>
                </Box>
                <Box bottom="0" position="absolute" height="2rem">
                    <Box display="flex" marginLeft="-4">
                    <Box marginLeft="3">
                        <>
                        {props.vertical ? <Badge intent="neutral" size="small">Vertical: {props.vertical}</Badge> : <></>}
                        </>
                        <>
                        {props.horizontal ? <Badge intent="neutral" size="small">Horizontal: {props.horizontal}</Badge> : <></>}
                        </>
                    </Box>
                    </Box>
                    <Box marginTop=".3rem">
                        { props.verified == 'True' && countViews ? 
                        <>
                        <Text fontSize='xxsmall' variant="secondary" marginRight="2">{countViews} Views, </Text>
                        <Text fontSize='xxsmall' variant="secondary">{countFavorites} Favorites </Text>
                        </>
                        : <Text fontSize='xxsmall' variant="secondary" marginRight="2">This is an unverified demo </Text>
                        }       
                    </Box>
                </Box>
            </CardContent>
        </Card>
        </Box>   
    )
    // return(
    //     <CustomBox position="relative">
    //         {/* only show a banner if new material has been added in the past 2 weeks */}
    //             {today - props.new_banner.last_updated_at.seconds< 14*60*60*24 ? 
    //             <Box maxHeight="10%" display="flex" right="1em" top="1rem" position="absolute" marginBottom=".5rem">
    //             <Badge intent="inform">
    //                 New {props.new_banner.type}!
    //             </Badge>
    //             </Box> 
    //             : <></>
    //             }
    //         <Box marginTop="1.5rem" maxWidth="100%" maxHeight ="40%" overflow="hidden" >
    //             <img
    //                   onClick={() => handleImageClick(props.id)}
    //                 src={svg}
    //                 style={{ minWidth: '100%' , minHeight: '100%'}}
    //                 />
    //         </Box>
    //         <Box maxHeight="40%">
    //             <Box display="flex" marginBottom="7" marginTop="1rem"><Heading fontSize="medium" fontWeight="bold">{props.name}</Heading>
    //                 { favorite ? 
    //                     <Tooltip content={"Unfavorite All Demos with " + overviewTitle + " Dashboard"} width="10rem">
    //                         <IconButton label="Unfavorite" icon="Favorite" onClick={()=>handleFavorite(false)}/>
    //                     </Tooltip> 
    //                     : 
    //                     <Tooltip content={"Favorite All Demos with "+ overviewTitle + " Dashboard"} width="10rem">
    //                         <IconButton label="Favorite" icon="FavoriteOutline" onClick={()=>handleFavorite(true)} />
    //                     </Tooltip> 
    //                 }
    //             </Box>
    //             <Paragraph fontSize='xsmall'>{props.description}</Paragraph>
    //         </Box>
    //         <Box marginTop="1rem" bottom="0" marginBottom="1rem" position="absolute">
    //             <Box display="flex" marginLeft="-4">
    //                 <Badge intent="neutral" size="small">Vertical: {props.vertical}</Badge>
    //                 <Box marginLeft="3"><Badge intent="neutral" size="small">Horizontal: {props.horizontal}</Badge></Box>
    //             </Box>
    //             <Box marginTop=".3rem">
    //                 <Text fontSize='xxsmall' variant="secondary" marginRight="2">{countViews} Views, </Text>
    //                 <Text fontSize='xxsmall' variant="secondary">{countFavorites} Favorites </Text>
    //             </Box>
    //         </Box>
    //     </CustomBox>
    // )
}

export const CustomBox = styled(Box as any)`
  padding:20;
  height:400;
  border-radius:6px;
  overflow:hidden;
  box-shadow:rgba(0, 0, 0, 0.11) 0px 2px 12px, rgba(0, 0, 0, 0.04) 0px 1px 4px;
  `

export const StyledCardContent = styled(CardContent as any)`
  padding:10;
`