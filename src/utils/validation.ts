export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 20;
};

export const validatePostTitle = (title: string): boolean => {
  return title.length >= 3 && title.length <= 100;
};

export const validatePostContent = (content: string): boolean => {
  return content.length >= 10;
};

export const validateCommentContent = (content: string): boolean => {
  return content.length >= 1 && content.length <= 500;
};