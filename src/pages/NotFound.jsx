import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import constant from '../utils/constant';

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
            <Text fontSize='4xl' fontWeight='bold'>{constant.label.pageNotFound}</Text>
            <Text mt={4}>{constant.label.notExist}</Text>
            <Button mt={6} colorScheme='blue' onClick={() => navigate(constant.routes.signIn)}>
                {constant.label.backToHome}
            </Button>
        </Box>
    );
};

export default NotFound;
