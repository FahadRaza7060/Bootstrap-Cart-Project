import { useCallback, useEffect, useState } from "react";

const Cart = () => {

    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [selectCategory, setSelectCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [cartItems, setCartItems] = useState([]);

    const fetchProducts = useCallback((searchQuery) => {
        // console.log('Fetching Products');

        let url = 'https://dummyjson.com/products';

        if (searchQuery.length > 2) {
            url = `https://dummyjson.com/products/search?q=${searchQuery}`;
        }

        fetch(url).then(response => response.json()).then(data => {

            console.log('data', data);
            console.log('products array', data.products);

            setProducts(data.products);
            productCategories(data.products);
        }).catch(error => {
            console.log('Error Fetching Products', error);
        });
    }, [searchQuery]);

    const productCategories = (prodCate) => {
        // console.log(prodCate[0].category);
        let productCategoryArray = ['ALL'];

        prodCate.map(data => {
            let flag = false;
            productCategoryArray.map(categ => {
                if (data.category === categ) {
                    flag = true
                }
            })

            if (!flag) {
                productCategoryArray.push(data.category);
            }
        })

        setCategory(productCategoryArray);
    }

    const handleShowCategoryCard = (specificCategory) => {
        // console.log(specificCategory);
        setSelectedCategory(specificCategory);
        // setSelectCategory([]);

        const temp = [];

        products.map(prod => {
            if (prod.category == specificCategory) {
                // setSelectCategory(prev => [...prev, prod]);
                temp.push(prod);
            }
        })
        setSelectCategory(temp);
    }

    const handleAddToCart = (product) => {
        // console.log('product', product);

        let isItemExist = false;
        let val

        cartItems.map((item, index) => {

            if (item.id === product.id) {
                isItemExist = true;
                val = index;
            }
        })

        // console.log('existItem', product);

        if (!isItemExist) {
            setCartItems([...cartItems, { ...product, quantity: 1 }])
        } else {
            cartItems[index].quantity++;

            setCartItems([...cartItems]);
        }
    }

    useEffect(() => {
        fetchProducts(searchQuery);
    }, [searchQuery]);

    return (
        <div className="products-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-section">
                    <h3> Search </h3>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="sidebar-section">
                    <h3> Categories </h3>
                    <ul className="category-list">
                        {
                            category.map((category, index) => (
                                <div key={index}>
                                    {/* ${!selectedCategory && category === 'ALL' ? 'active' : ''}  */}
                                    <li
                                        className={`${selectedCategory === category ? 'active' : ''}`} onClick={() => handleShowCategoryCard(category)}> {category} </li>
                                </div>
                            ))
                        }

                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="products-main">

                <div className="products-header">
                    <div>
                        <h1> Our Products </h1>
                        <p> Showing {products.length} products </p>
                    </div>
                    {/* Cart icons */}
                    <button
                        className="cart-button"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                    >
                        <span className="cart-icon">🛒</span>
                        <span className="cart-text">Cart</span>
                        <span className="cart-count"> {cartItems.length} </span>
                    </button>
                </div>

                {/* Model show */}
                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel"> Your Cart </h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                ...
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal"> Close </button>
                                <button type="button" class="btn btn-primary"> Checkout </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="products-grid">
                    {
                        products.length === 0 ? (
                            <h2> No Products Found. </h2>
                        ) : (
                            <>
                                {
                                    selectedCategory === 'ALL' || !selectedCategory ? (
                                        <>
                                            {
                                                products.map(product => (
                                                    <div className="product-card" key={product.id}>
                                                        <div className="product-image">
                                                            <img src={product.images} alt="image..." />
                                                        </div>
                                                        <div className="product-details">
                                                            <p className="product-category"> {product.category} </p>
                                                            <h3 className="product-name"> {product.title} </h3>
                                                            <div className="product-tags">
                                                                <span className="tag"> {product.tags[0]} </span>
                                                                <span className="tag"> {product.tags[1]} </span>
                                                            </div>
                                                            <p className="product-description"> {product.description} </p>
                                                            <div className="product-footer">
                                                                <span className="product-price"> {product.price} </span>
                                                                <button className="btn-add-to-cart" onClick={() => handleAddToCart(product)}> Add to Cart </button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                )
                                                )
                                            }
                                        </>
                                    ) : (
                                        <>
                                            {
                                                selectCategory.map(product => (
                                                    <div className="product-card" key={product.id}>
                                                        <div className="product-image">
                                                            <img src={product.thumbnail} alt={product.title} />
                                                        </div>
                                                        <div className="product-details">
                                                            <p className="product-category"> {product.category} </p>
                                                            <h3 className="product-name"> {product.title} </h3>
                                                            <div className="product-tags">
                                                                <span className="tag"> {product.tags[0]} </span>
                                                                <span className="tag"> {product.tags[1]} </span>
                                                            </div>
                                                            <p className="product-description"> {product.description} </p>
                                                            <div className="product-footer">
                                                                <span className="product-price"> {product.price} </span>
                                                                <button className="btn-add-to-cart"> Add to Cart </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </>
                                    )
                                }
                            </>

                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Cart