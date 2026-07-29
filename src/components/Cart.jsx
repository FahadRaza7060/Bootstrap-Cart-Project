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

            // console.log('data', data);
            // console.log('products array', data.products);

            setProducts(data.products);
            productCategories(data.products);
        }).catch(error => {
            console.log('Error Fetching Products', error);
        });
    }, [searchQuery]);

    // ----- Product Categories show function-------
    const productCategories = (prodCate) => {
        // console.log(prodCate);
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
        
        // console.log('ProductCategoryArray', productCategoryArray);
        setCategory(productCategoryArray);
    }

    const handleShowCategoryCard = (specificCategory) => {
        console.log(specificCategory);
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

    // -------- Add to cart functionality ------- 
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

            cartItems[val].quantity++;

            setCartItems([...cartItems]);
        }
    }

    // ---------- quantity shown in the cart button -----------
    function showTotalQuantity() {
        let data = 0;
        for (let i = 0; i < cartItems.length; i++) {
            data += cartItems[i].quantity;
        }
        return data;
    }

    // ------- Delete items form the cart -----------
    const removeFromCart = (id) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== id));
    }

    // ------- increase Quantity functionality ------------
    const increaseQuantity = (id) => {
        cartItems.map((item, index) => {
            if (item.id == id) {
                cartItems[index].quantity++;
                setCartItems([...cartItems]);
            }
        })
    }

    // ------- decrease Quantity functionality ------------
    const decreaseQuantity = (id) => {
        cartItems.map((item, index) => {

            if(item.id == id) {
                cartItems[index].quantity--;

                if (cartItems[index].quantity === 0) {
                    removeFromCart(id);
                } else {
                    setCartItems([...cartItems]);
                }
            }
        })
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
                        data-toggle="modal"
                        data-target="#exampleModal"
                    >
                        <span className="cart-icon">🛒</span>
                        <span className="cart-text">Cart</span>
                        <span className="cart-count"> {showTotalQuantity()} </span>
                    </button>

                    {/* modal */}
                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel"> Cart Items </h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <ul className="list-group shadow-sm">
                                        {cartItems.length == 0 ? (
                                            <li className="list-group-item text-center text-muted p-3">
                                                Your cart is empty!
                                            </li>
                                        ) : (
                                            cartItems.map((item) => (
                                                <li
                                                    key={item.id}
                                                    className="list-group-item d-flex justify-content-between align-items-center p-3"
                                                >
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img
                                                            src={item.thumbnail}
                                                            alt={item.title}
                                                            style={{
                                                                width: "45px",
                                                                height: "45px",
                                                                objectFit: "cover",
                                                                borderRadius: "5px",
                                                            }}
                                                        />

                                                        <div>
                                                            <div className="fw-semibold"> {item.title} </div>
                                                            <div> ${item.price} </div>
                                                        </div>

                                                    </div>

                                                    <div className="d-flex align-items-center gap-2">
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => decreaseQuantity(item.id)}
                                                        >
                                                            -
                                                        </button>

                                                        <span className="fw-bold"> {item.quantity} </span>

                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => increaseQuantity(item.id)}
                                                        >
                                                            +
                                                        </button>

                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => removeFromCart(item.id)}
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </li>
                                            ))
                                        )
                                        }
                                    </ul>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary"> Checkout </button>
                                </div>
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
        </div >
    );
};

export default Cart