import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import Feed from './components/feed/Feed';
import SubscriptionManager from './components/feed/SubscriptionManager';
import PostDetail from './components/blog/PostDetail';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/posts" replace />,
      },
      {
        path: "posts",
        element: <div />, // Обрабатывается внутри App
      },
      {
        path: "feed",
        element: <Feed />,
      },
      {
        path: "subscriptions",
        element: <SubscriptionManager />,
      },
      {
        path: "post/:id",
        element: <PostDetail />,
      },
      {
        path: "profile",
        element: <div />, // Обрабатывается внутри App
      },
      {
        path: "*",
        element: <Navigate to="/posts" replace />,
      }
    ]
  }
]);

export default router;