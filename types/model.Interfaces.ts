import { Optional } from 'sequelize';

// Comment Interfaces
export interface CommentAttributes {
  id: number;
  content: string;
  postId: number;
  userId: number ;
  parentId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}


export interface CommentCreationAttributes extends Optional<CommentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Post Interfaces
export interface PostAttributes {
  id: number;
  userId: number | UserAttributes;
  categoryId?: number | CategoryAttributes;
  title: string;
  content: string;
  readTime: number;
  image?: string | null;
  thumbnail?: string | null;
  createdAt: Date;
  updatedAt: Date;
}


export interface PostCreationAttributes extends Optional<PostAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// User Interfaces
export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture?: string | null;
  thumbnail?: string | null;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Category Interfaces
export interface CategoryAttributes {
  id: number;
  tag: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
