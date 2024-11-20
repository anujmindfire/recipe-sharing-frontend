import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang='en'>
                <title>Foodie - Your Recipe Hub</title>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <Head>
                    <meta name='description' content='Foodie - Explore recipes, share your culinary creations, and enjoy delicious dishes.' />
                    <meta name='keywords' content='Foodie, Recipes, Cooking, Food, Culinary, Delicious' />
                    <meta name='author' content='Foodie Team' />

                    <meta property='og:title' content='Foodie - Your Recipe Hub' />
                    <meta property='og:description' content='Explore and share recipes on Foodie.' />
                    <meta property='og:type' content='website' />
                    <meta property='og:image' content='/logo.png' />
                    <meta property='og:locale' content='en_US' />

                    <link rel='icon' href='/logo.png' />
                    <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
                    <link rel='manifest' href='/site.webmanifest' />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;