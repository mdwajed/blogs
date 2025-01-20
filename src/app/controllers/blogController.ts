import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import {
  NotFoundError,
  AuthorizationError,
  isErrorWithMessage,
} from '../utils/errors';
import { BlogQuery } from '../types/express';
import { Blog } from '../models/Models';

// Create Blog
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const newBlog = await Blog.create({
      title,
      content,
      author: req.user.id,
    });

    res.status(201).json(successResponse('Blog created successfully', newBlog));
  } catch (error) {
    if (isErrorWithMessage(error)) {
      res.status(500).json(errorResponse('Internal Server Error', error));
    } else {
      res.status(500).json(errorResponse('An unknown error occurred'));
    }
  }
};

// Update Blog
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);

    if (!blog) throw new NotFoundError('Blog not found');

    if (blog.author.toString() !== req.user.id) {
      throw new AuthorizationError(
        'You are not authorized to update this blog',
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, req.body, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json(successResponse('Blog updated successfully', updatedBlog));
  } catch (error) {
    if (isErrorWithMessage(error)) {
      res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, error));
    } else {
      res.status(500).json(errorResponse('An unknown error occurred'));
    }
  }
};
// Delete Blog
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) throw new NotFoundError('Blog not found');

    if (blog.author.toString() !== req.user.id) {
      throw new AuthorizationError(
        'You are not authorized to delete this blog',
      );
    }

    await blog.deleteOne();

    res.status(200).json(successResponse('Blog deleted successfully'));
  } catch (error) {
    if (isErrorWithMessage(error)) {
      res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, error));
    } else {
      res.status(500).json(errorResponse('An unknown error occurred'));
    }
  }
};
// Get All Blogs

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const { search, sortBy, sortOrder, filter } = req.query;
    const query: BlogQuery = {};

    if (search && typeof search === 'string') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (filter && typeof filter === 'string') {
      query.author = filter;
    }

    const blogs = await Blog.find(query)
      .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
      .populate('author', 'name email');

    res.status(200).json(successResponse('Blogs fetched successfully', blogs));
  } catch (error) {
    res.status(500).json(
      errorResponse('Internal Server Error', {
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    );
  }
};
