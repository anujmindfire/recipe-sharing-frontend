import React from 'react';
import Link from 'next/link';
import { Card, Rate } from 'antd';
import { RecipeCardProps } from '../interface/Interface';

const RecipeCard: React.FC<RecipeCardProps> = ({ recipes }) => {
    return (
        <section className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5'>
            {recipes.map((recipe) => (
                <Link key={recipe._id} href={`/recipes/${recipe._id}`} passHref>
                    <div className='flex flex-col rounded-lg shadow-md bg-[#f5f0e5] cursor-pointer transition-transform duration-200 hover:scale-105'>
                        <Card
                            className='rounded-lg'
                            cover={
                                <div
                                    className='w-full aspect-video bg-center bg-no-repeat bg-cover rounded-t-lg'
                                    style={{ backgroundImage: `url(${recipe.imageUrl})` }}
                                />
                            }
                        >
                            <Card.Meta
                                title={<div className='text-sm font-semibold'>{recipe.title}</div>}
                                description={
                                    <div className='flex items-center'>
                                        <Rate 
                                            allowHalf 
                                            value={recipe.averageRating} 
                                            disabled
                                        />
                                        <span className='text-gray-600'>{`(${recipe.totalRating})`}</span>
                                    </div>
                                }
                            />  
                        </Card>
                    </div>
                </Link>
            ))}
        </section>
    );
};

export default RecipeCard;
