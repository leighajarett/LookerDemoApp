import { Heading, Box, FieldCheckbox, Space, Fieldset, List, ListItem, Paragraph, FieldSelectMulti, Grid } from '@looker/components'
import React, { useState, useEffect } from "react"

export default function DemoContent(){
    // const [verticals, setVerticals] = useState(['Financial Services','Retail','Healthcare']);
    // const [horizontals, setHorizontals] = useState(['Customer Success','Marketing','Operations']);
    // const [tags, setTags] = useState(['BQML','Google Healthcare API','Nested Fields']);
    const [verticals, setVerticals] = useState([{value:'Financial Services'},{value:'Retail'},{value:'Healthcare'}])
    const [horizontals, setHorizontals] = useState([{value:'Customer Success'},{value:'Marketing'},{value:'Operations'}])
    const [tags, setTags] = useState([{value:'BQML'},{value:'Google Healthcare API'},{value:'Nested Fields'}])

    // Get all the possible options for filters
    useEffect(()=>{
        // query firestore to get all unique verticals
        // String value = document.getString("username");
    }
    ,[])

    return(
        <Box display="flex" width="100%" paddingTop="2em" padding="2em">
            <Box width="40%">
                <Heading color="key" fontSize="xlarge" fontWeight="bold">Available Demo Content</Heading>
                <Heading marginTop="1em" fontSize="small">Use the filters to browse for the demo content you need. 
                Click into any demo tile to see details and link out to content</Heading>
            </Box>
            <Box display="flex" marginLeft="auto" marginRight="0" maxWidth="60%">
                {/* <FilterCheckbox label='Verticals' list={verticals}></FilterCheckbox>
                <FilterCheckbox label='Horizontals' list={horizontals}></FilterCheckbox>
                <FilterCheckbox label='Tags' list={tags}></FilterCheckbox> */}
                <Grid columns={3}>
                    <FieldSelectMulti 
                        // description="this is the description"
                        // detail="detail..."
                        label="Vertical"
                        options={verticals}
                    />
                    <FieldSelectMulti 
                        // description="this is the description"
                        // detail="detail..."
                        label="Horizontals"
                        options={horizontals}
                    />
                    <FieldSelectMulti 
                        // description="this is the description"
                        // detail="detail..."
                        label="Tags"
                        options={tags}
                    />
                </Grid>
            </Box>
        </Box>
    )
}

// export function FilterCheckbox(props){
//     // state for each child checkbox
//     const [checks, setChecks] = useState([]);
//     // state for parent all checkbox
//     const [allCheck, setAllChecks] = useState(true);
//     const [testChild, setChild] = useState(true);


//     // initialize the child checkbox states
//     useEffect(() => {
//         var checksObj = [];
//         for (var i=0;i<props.list.length;i++){
//             checksObj.push({"label":props.list[i],"key":i, "checked":false})
//         }
//         setChecks(checksObj);
//       },[props.list]);


//     // function handleAllChecked(){
//     //     let verticals_ = verticals
//     //     verticals_.forEach(vertical => vertical.checked = !vertical.checked) 
//     //     setVerticals(verticals_)
//     //   }
    
//     function handleCheckChildElement(key){
//         // make a local copy of the list
//         let list = checks;
//         // find the checkbox that was clicked and change the state to be either checked / unchecked
//         checks.forEach(element => {
//             if (element.key === key)
//                 element.checked = !element.checked 
//         })
//         // update the state
//         setChecks(list);
//         console.log(checks)
//     }
    
//     return(
//         <Box marginRight="2rem">
//             <Fieldset legend={props.label} accordion>
//             <List>
//                 <ListItem>
//                     <FieldCheckbox
//                     label={"All " + props.label}
//                     // onChange={handleAllChecked}
//                     checked={allCheck}
//                     />
//                 </ListItem>
//                 <ListItem>
//                 <List pl="large">
//                     <ListItem>
//                         {checks.map((element) => <FieldCheckbox  onChange={() => handleCheckChildElement(element.key)} {...element} />)}
//                     </ListItem>
//                 </List>
//                 </ListItem>
//             </List>   
//             </Fieldset>
//         </Box>
//     )
// }
