import { Box, HStack, Text, VStack, Icon } from "@chakra-ui/react";
import { FaHeart } from '@react-icons/all-files/fa/FaHeart';
import { useContext } from "react";
import { Link, NavLink, Redirect } from "react-router-dom";
import { UserContext } from "../UserProvider";
import routes from '../../routes';
import './DashboardLayout.css';

const santizePath = path => path.replace(/\/:[^/].*/g, '');

export default function DashboardLayout({ children }) {
    const { user } = useContext(UserContext);
    const { logout } = useContext(UserContext);
    if (process.env.NODE_ENV === 'production') {
        if (!user) {
            return <Redirect path='/'/>;
        }
    }
    

    const onSubmit = async (action) => {
        if (action == 'logout'){
            await logout();
        }
    };

    return (
        <VStack padding='0 1rem' w="100%" h="100%" bgGradient="linear(to-r, green.200, pink.500)">
            <HStack padding='2rem 0' as='nav' width='100%' maxW='1000px'>
                <HStack className='dashboard__logo' as={Link} to='/' marginRight='auto'>
                    <Icon as={FaHeart}/>
                    <Text size='sm' fontWeight='bold'>Couple Finder</Text>
                </HStack>
                <HStack listStyleType='none' as='ul' fontWeight='bold'>
                    {routes.filter(route => route.name).map((route, key) => (
                        <li key={key}>
                            {/* if button is for signout add signout request to button */}
                            {route.name === "SignOut" &&
                                <NavLink
                                activeClassName='dashboard__link--active'
                                className='dashboard__link'
                                to={santizePath(route.path)}
                                exact={route.exact}
                                onClick={() => onSubmit(`logout`)}
                            >
                                {route.name}
                            </NavLink>}
                            {route.name !== "SignOut" &&
                            <NavLink
                                activeClassName='dashboard__link--active'
                                className='dashboard__link'
                                to={santizePath(route.path)}
                                exact={route.exact}
                            >
                                {route.name}
                            </NavLink>}
                        </li>
                    ))}
                </HStack>
            </HStack>
            <Box as='main' width='100%' maxW='1000px'>
                {children}
            </Box>
        </VStack>
    );
}