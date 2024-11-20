import React from 'react';
import {
    Modal,
    Button,
    Input,
    Tooltip,
    Row,
    Col,
    Typography,
} from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { ShareModalProps } from '../types/types';
import constant from '../utils/constant';

const { Text } = Typography;

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, recipeTitle, recipeLink }) => {
    const [copied, setCopied] = React.useState(false);

    const message = `${constant.label.checkRecipe} ${recipeTitle} - ${recipeLink}`;

    const socialShareLinks = [
        { icon: <FacebookOutlined />, label: 'Share on Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(message)}` },
        { icon: <TwitterOutlined />, label: 'Share on Twitter', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(message)}` },
        { icon: <InstagramOutlined />, label: 'Share on Instagram', url: `https://www.instagram.com/?url=${encodeURIComponent(message)}` },
        { icon: <WhatsAppOutlined />, label: 'Share on WhatsApp', url: `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}` },
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(recipeLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal
            visible={isOpen}
            onCancel={onClose}
            footer={null}
            title='Share'
            centered
        >
            <Text className='text-center' style={{ marginBottom: '16px' }}>
                {constant.label.sharelink}
            </Text>
            <Row justify='center' gutter={[16, 16]}>
                {socialShareLinks.map(({ icon, label, url }, index) => (
                    <Col key={index}>
                        <Tooltip title={label}>
                            <Button
                                href={url}
                                target='_blank'
                                icon={icon}
                                shape='circle'
                                size='large'
                                style={{ color: '#4B0082' }}
                            />
                        </Tooltip>
                    </Col>
                ))}
            </Row>

            <Text className='text-center' style={{ margin: '16px 0' }}>
                {constant.label.copyLink}
            </Text>
            <Row justify='center' align='middle' gutter={[8, 8]}>
                <Col flex='auto'>
                    <Input
                        value={recipeLink}
                        readOnly
                        style={{ backgroundColor: '#f5f5f5', borderColor: '#d9d9d9' }}
                    />
                </Col>
                <Col>
                    <Button
                        onClick={handleCopy}
                        type={copied ? 'primary' : 'default'}
                        icon={<CopyOutlined />}
                    >
                        {copied ? 'Copied' : 'Copy'}
                    </Button>
                </Col>
            </Row>
        </Modal>
    );
};

export default ShareModal;