import { MenuList, MenuItem, Tooltip, Divider, DividerVertical, Box, Paragraph, Button, Heading, SpaceVertical } from '@looker/components'
import { Link as RouterLink } from 'react-router-dom'
import React from "react"
import { ROUTES } from "./Extension"

export default function SidePanel(props: any){
    return (
          <Box minWidth="20rem" maxWidth="20rem" minHeight="100%" overflow="hidden" display="flex" flexDirection="column" borderRight="1px solid #DAE2F1">
            <Box margin="1rem" width="100%" display="flex">
              <Box width="82px">
              <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 714.71 189.8" width="100%" height="100%"><defs>
              </defs><g id="Layer_2" data-name="Layer 2"><g id="specs">
                <path fill="#5f6368" d="M58.49,0A16.6,16.6,0,0,0,44.72,25.86l7.09-7.08a6.88,6.88,0,0,1-.35-2.19,7,7,0,1,1,7,7,6.87,6.87,0,0,1-2.18-.35l-7.08,7.08A16.59,16.59,0,1,0,58.49,0Z"/>
                <path fill="#5f6368" d="M51.89,48.35a25.79,25.79,0,0,0-5.17-15.54L37.52,42A13.19,13.19,0,0,1,35,57.92l5,12.22A25.93,25.93,0,0,0,51.89,48.35Z"/>
                <path fill="#5f6368" d="M26.18,61.54h-.24a13.2,13.2,0,1,1,7.25-24.23l9.11-9.11A25.94,25.94,0,1,0,25.94,74.29a26.53,26.53,0,0,0,5.24-.52Z"/>
                <path fill="#5f6368"  d="M58.84,72.11a58.87,58.87,0,0,0-17,2.49l7.29,17.81a40.19,40.19,0,0,1,9.7-1.18,39.71,39.71,0,1,1-28.09,11.63,40.12,40.12,0,0,1,9.47-7L33,78.1a58.87,58.87,0,1,0,25.89-6Z"/>
                <path fill="#5f6368" d="M174.72,24.34h16.55V149.27H252.2V165H174.72Z"/>
                <path fill="#5f6368" d="M276.19,158.23a47.42,47.42,0,0,1-17.66-18.51,53.43,53.43,0,0,1-6.33-25.88A53.43,53.43,0,0,1,258.53,88a47.42,47.42,0,0,1,17.66-18.51,51.17,51.17,0,0,1,51,0A47.56,47.56,0,0,1,344.86,88a53.54,53.54,0,0,1,6.33,25.88,53.54,53.54,0,0,1-6.33,25.88,47.56,47.56,0,0,1-17.66,18.51,51.17,51.17,0,0,1-51,0Zm42-12.18A32.79,32.79,0,0,0,330.5,133.3a39.31,39.31,0,0,0,4.63-19.46,39.34,39.34,0,0,0-4.63-19.46,32.79,32.79,0,0,0-12.28-12.75,32.37,32.37,0,0,0-16.53-4.44,32.84,32.84,0,0,0-29,17.19,39.44,39.44,0,0,0-4.62,19.46,39.42,39.42,0,0,0,4.62,19.46,33,33,0,0,0,45.53,12.75Z"/>
                <path fill="#5f6368" d="M383.77,158.23a47.56,47.56,0,0,1-17.66-18.51,53.54,53.54,0,0,1-6.33-25.88A53.54,53.54,0,0,1,366.11,88a47.56,47.56,0,0,1,17.66-18.51,51.17,51.17,0,0,1,51,0A47.49,47.49,0,0,1,452.44,88a53.54,53.54,0,0,1,6.33,25.88,53.54,53.54,0,0,1-6.33,25.88,47.49,47.49,0,0,1-17.66,18.51,51.17,51.17,0,0,1-51,0Zm42-12.18a32.86,32.86,0,0,0,12.28-12.75,39.42,39.42,0,0,0,4.63-19.46,39.45,39.45,0,0,0-4.63-19.46,32.86,32.86,0,0,0-12.28-12.75,32.37,32.37,0,0,0-16.53-4.44,32.92,32.92,0,0,0-16.63,4.44,32.59,32.59,0,0,0-12.37,12.75,39.34,39.34,0,0,0-4.63,19.46,39.31,39.31,0,0,0,4.63,19.46,32.59,32.59,0,0,0,12.37,12.75,32.92,32.92,0,0,0,16.63,4.44A32.37,32.37,0,0,0,425.81,146.05Z"/>
                <path fill="#5f6368" d="M470.66,24.34H487.2v88.92L537,62.67h21v.78l-42,42.41,40.1,58.4V165H536.26l-31.93-47.7L487.2,134.47V165H470.66Z"/>
                <path fill="#5f6368" d="M577.45,158.42a45.88,45.88,0,0,1-17.1-18.23A55.12,55.12,0,0,1,554.22,114,57.48,57.48,0,0,1,560,88.43a46.28,46.28,0,0,1,16.43-18.8,43.74,43.74,0,0,1,24.47-7q14.16,0,24.56,6.33a42.1,42.1,0,0,1,16,17.48A56.33,56.33,0,0,1,647,112a33.68,33.68,0,0,1-.38,4.91H570.27q.57,11,5.29,18.52a30.89,30.89,0,0,0,12,11.33,32.56,32.56,0,0,0,15.21,3.78q18.88,0,28.52-17.38l13.6,6.61a47.9,47.9,0,0,1-16.81,18.42Q617.31,165,602.2,165A46.92,46.92,0,0,1,577.45,158.42ZM630,103.64a31.32,31.32,0,0,0-3.4-12.09,26.08,26.08,0,0,0-9.45-10.2q-6.42-4.16-16.24-4.16a27.52,27.52,0,0,0-19.27,7.27q-7.93,7.28-10.39,19.18Z"/>
                <path fill="#5f6368" d="M657.68,62.69h15.76v19h.78q2.92-8.18,11.29-13.63A31.66,31.66,0,0,1,703,62.64a28.83,28.83,0,0,1,11.68,2.15V82.5a31,31,0,0,0-14-3.12,23.07,23.07,0,0,0-13.24,4.1,29.53,29.53,0,0,0-9.64,11,31.92,31.92,0,0,0-3.6,14.93V165H657.68Z"/></g></g>
                </svg>
              </Box>
              <Paragraph marginLeft="10" marginTop="2" color="key" fontSize="xlarge" fontWeight="bold">Demo Application</Paragraph></Box>
            <Box marginTop="10">
              <MenuList>
                <RouterLink to={ROUTES.HOME_ROUTE}>
                  <MenuItem icon="Home">
                    Home
                  </MenuItem>
                </RouterLink>
                <Divider></Divider>
                <RouterLink to={ROUTES.CONTENT_ROUTE}>
                  <MenuItem icon="Dashboard" tooltip="Browse available demo dashboards, datasets and supporting material">
                    Demo Content
                  </MenuItem>
                </RouterLink>
                <Divider></Divider>
                <RouterLink to={ROUTES.WORKSHOP_ROUTE}>
                  <MenuItem icon="Explore" tooltip="Learn more about trial.looker.com and leveraging demo content in PoCs" >
                    Workshop PoCs
                  </MenuItem>
                </RouterLink>
                <Divider></Divider>
                <RouterLink to={ROUTES.REQUESTS_ROUTE}>
                  <MenuItem icon="Group" tooltip="Submit tickets to the demo team for feature requests, bugs, or additional support">
                    Submit Requests
                  </MenuItem>
                </RouterLink>
                <Divider></Divider>
                <RouterLink to={ROUTES.NEW_ROUTE}>
                  <MenuItem icon="Reports" tooltip="Get started creating a new Looker / GCP demo">
                    Create New Demo
                  </MenuItem>
                </RouterLink>
                <Divider></Divider>
                <RouterLink to={ROUTES.INSTANCE_ROUTE}>
                  <MenuItem icon="LogoRings" tooltip="Learn about the different demo instances and their scope of use">
                    Demo Instances
                  </MenuItem>
                </RouterLink>
                <Divider></Divider>
                <RouterLink to={ROUTES.ADMIN_ROUTE}>
                  <MenuItem icon="AddAlerts" tooltip="Review admin panel for Looker demo instances">
                    System Admin
                  </MenuItem>
                </RouterLink>
              </MenuList>
            </Box>
        </Box>
    )
  }