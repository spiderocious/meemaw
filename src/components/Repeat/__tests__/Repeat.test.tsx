import { render, screen } from '@testing-library/react';
import { Repeat } from '../Repeat';

describe('Repeat', () => {
  describe('repeat with "times" prop', () => {
    it('should render children n times', () => {
      render(
        <Repeat times={3}>
          <div>Item</div>
        </Repeat>
      );

      const items = screen.getAllByText('Item');
      expect(items).toHaveLength(3);
    });

    it('should render with render function and index', () => {
      render(
        <Repeat times={3}>
          {(_, index) => <div key={index}>Item {index}</div>}
        </Repeat>
      );

      expect(screen.getByText('Item 0')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should render nothing when times is 0', () => {
      const { container } = render(
        <Repeat times={0}>
          <div>Item</div>
        </Repeat>
      );

      expect(container.textContent).toBe('');
    });

    it('should handle large repeat counts', () => {
      render(
        <Repeat times={100}>
          {(_, index) => <div key={index}>Item {index}</div>}
        </Repeat>
      );

      const items = screen.getAllByText(/Item \d+/);
      expect(items).toHaveLength(100);
    });

    it('should render static children multiple times', () => {
      render(
        <Repeat times={5}>
          <span>★</span>
        </Repeat>
      );

      const stars = screen.getAllByText('★');
      expect(stars).toHaveLength(5);
    });
  });

  describe('repeat with "each" prop (array iteration)', () => {
    it('should iterate over array with render function', () => {
      const items = ['Apple', 'Banana', 'Cherry'];

      render(
        <Repeat each={items}>
          {(item, index) => (
            <div key={index}>
              {index}: {item}
            </div>
          )}
        </Repeat>
      );

      expect(screen.getByText('0: Apple')).toBeInTheDocument();
      expect(screen.getByText('1: Banana')).toBeInTheDocument();
      expect(screen.getByText('2: Cherry')).toBeInTheDocument();
    });

    it('should iterate over array with static children', () => {
      const items = [1, 2, 3];

      render(
        <Repeat each={items}>
          <div>Static</div>
        </Repeat>
      );

      const elements = screen.getAllByText('Static');
      expect(elements).toHaveLength(3);
    });

    it('should handle empty array', () => {
      const { container } = render(
        <Repeat each={[]}>
          {(item) => <div>{item}</div>}
        </Repeat>
      );

      expect(container.textContent).toBe('');
    });

    it('should work with array of objects', () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];

      render(
        <Repeat each={users}>
          {(user) => (
            <div key={user.id}>
              {user.id}: {user.name}
            </div>
          )}
        </Repeat>
      );

      expect(screen.getByText('1: Alice')).toBeInTheDocument();
      expect(screen.getByText('2: Bob')).toBeInTheDocument();
      expect(screen.getByText('3: Charlie')).toBeInTheDocument();
    });

    it('should work with array of numbers', () => {
      const numbers = [10, 20, 30, 40];

      render(
        <Repeat each={numbers}>
          {(num, index) => (
            <div key={index}>Value: {num}</div>
          )}
        </Repeat>
      );

      expect(screen.getByText('Value: 10')).toBeInTheDocument();
      expect(screen.getByText('Value: 20')).toBeInTheDocument();
      expect(screen.getByText('Value: 30')).toBeInTheDocument();
      expect(screen.getByText('Value: 40')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should render nothing when neither times nor each is provided', () => {
      const { container } = render(
        <Repeat>
          <div>Item</div>
        </Repeat>
      );

      expect(container.textContent).toBe('');
    });

    it('should prioritize "each" over "times" when both are provided', () => {
      const items = ['A', 'B'];

      render(
        <Repeat times={5} each={items}>
          {(item) => <div key={item}>{item}</div>}
        </Repeat>
      );

      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.queryByText('C')).not.toBeInTheDocument();

      // Should only render 2 items from "each", not 5 from "times"
      const divs = screen.getAllByText(/[AB]/);
      expect(divs).toHaveLength(2);
    });

    it('should handle complex children structures', () => {
      render(
        <Repeat times={2}>
          {(_, index) => (
            <div key={index}>
              <h1>Title {index}</h1>
              <p>Description {index}</p>
            </div>
          )}
        </Repeat>
      );

      expect(screen.getByText('Title 0')).toBeInTheDocument();
      expect(screen.getByText('Description 0')).toBeInTheDocument();
      expect(screen.getByText('Title 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
    });
  });

  describe('TypeScript generics', () => {
    it('should infer type from array', () => {
      interface Product {
        id: number;
        name: string;
        price: number;
      }

      const products: Product[] = [
        { id: 1, name: 'Widget', price: 9.99 },
        { id: 2, name: 'Gadget', price: 19.99 },
      ];

      render(
        <Repeat each={products}>
          {(product) => (
            <div key={product.id}>
              {product.name}: ${product.price}
            </div>
          )}
        </Repeat>
      );

      expect(screen.getByText('Widget: $9.99')).toBeInTheDocument();
      expect(screen.getByText('Gadget: $19.99')).toBeInTheDocument();
    });
  });

  describe('real-world use cases', () => {
    it('should render star rating', () => {
      const rating = 4;
      const maxStars = 5;

      render(
        <div data-testid="rating">
          <Repeat times={maxStars}>
            {(_, index) => <span key={index}>{index < rating ? '★' : '☆'}</span>}
          </Repeat>
        </div>
      );

      const ratingDiv = screen.getByTestId('rating');
      expect(ratingDiv.textContent).toBe('★★★★☆');
    });

    it('should render skeleton loaders', () => {
      render(
        <Repeat times={3}>
          <div className="skeleton-loader">Loading...</div>
        </Repeat>
      );

      const loaders = screen.getAllByText('Loading...');
      expect(loaders).toHaveLength(3);
    });

    it('should render list of items from API data', () => {
      const apiResponse = [
        { id: 'a1', title: 'First Post', author: 'Alice' },
        { id: 'b2', title: 'Second Post', author: 'Bob' },
        { id: 'c3', title: 'Third Post', author: 'Charlie' },
      ];

      render(
        <ul>
          <Repeat each={apiResponse}>
            {(post) => (
              <li key={post.id}>
                <strong>{post.title}</strong> by {post.author}
              </li>
            )}
          </Repeat>
        </ul>
      );

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('by Alice')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.getByText('by Bob')).toBeInTheDocument();
    });
  });
});
