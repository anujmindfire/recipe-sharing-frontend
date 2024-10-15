import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Box 
            display='flex' 
            flexDirection='column' 
            justifyContent='center' 
            alignItems='center' 
            height='100vh'
            textAlign='center'
            backgroundColor='#262626'
            color='white'
        >
            <Text fontSize='4xl' fontWeight='bold'>404 - Page Not Found</Text>
            <Text mt={4}>The page you are looking for does not exist.</Text>
            <Button mt={6} colorScheme='blue' onClick={() => navigate('/signin')}>
                Go Back to Home
            </Button>
        </Box>
    );
};

export default NotFound;
