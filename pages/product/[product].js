import React, { useState, useRef } from 'react';
import { client, urlFor } from '../../library/client';
import css from '../../styles/ProductCredentials.module.css';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RiArrowGoBackFill } from 'react-icons/ri';
import {
  AiFillStar,
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineStar,
} from 'react-icons/ai';
import BlockContent from '@sanity/block-content-to-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { useManageContext } from '../../context/ManageStateContext';
import { Footer } from '../../components';

const ProductCredentials = ({ singleProduct, commentProduct }) => {
  // Querying for data from backend (SANITY)

  const [index, setIndex] = useState(0);
  const {
    _id,
    name,
    image,
    slug: { current },
    description,
    new_price,
  } = singleProduct;

  const {
    addToCart,
    setQty,
    setShowCart,
    qty,
    increasedQuantity,
    decreaseQuantity,
  } = useManageContext();

  const [commentBody, setCommentBody] = useState('');
  const [names, setNames] = useState('');
  const [email, setEmail] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const usernameEl = useRef();
  const emailEl = useRef();
  const commentsEl = useRef();

  const handleOnSubmit = (event) => {
    // @desc prevent refresh
    event.preventDefault();

    // @desc reset input after submission.
    setComments('');

    // @desc getting values
    const { value: username } = usernameEl.current;
    const { value: comment } = commentsEl.current;
    const { value: email } = emailEl.current;

    // @desc, putting all value to one place, Object
    const formObj = {
      _id,
      username,
      email,
      comment,
    };

    const handlePostComment = async (formObj) => {
      const response = await fetch('/api/comment', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(formObj),
      });

      if (response.statusCode !== 200) {
        return;
      }

      const data = await response.json();
    };
    handlePostComment(formObj).then((response) => {
      setShowSuccessMessage(!showSuccessMessage);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    });
  };

  const handleBuyNow = () => {
    addToCart(singleProduct, qty);

    setShowCart(true);
  };

  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading....</div>;
  } else {
    return (
      <div className={css.ProductCredentials}>
        <Head>
          <title>| JestinaCommerce</title>
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <section>
          <Link href={'/'}>
            <div className={css.back}>
              <RiArrowGoBackFill className={css.icon} />
              <span> Back to all product</span>
            </div>
          </Link>
        </section>

        <section className={css.productSection}>
          <div className={css.imageSection}>
            <div className={css.image}>
              <div className={css.hide}>
                <Zoom>
                  <img
                    src={urlFor(image && image[index])}
                    alt={current}
                    className={css.img}
                    loading='lazy'
                  />
                </Zoom>
              </div>
            </div>

            <div className={css.otherImg}>
              {image &&
                image?.map((img, i) => (
                  <img
                    key={i}
                    src={urlFor(img && img)}
                    alt={name}
                    loading='lazy'
                    onMouseEnter={() => setIndex(i)}
                    className={`${css.smallImage} ${
                      i === index ? css.active : null
                    }`}
                  />
                ))}
            </div>
          </div>
          <div className={css.descriptionSection}>
            <h1>{name.replace("'", '')}</h1>
            <div className={css.reviews}>
              <div>
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiOutlineStar />
              </div>
              <div>{new_price}</div>
            </div>
            <h4>Details:</h4>
            <div>
              <BlockContent
                blocks={description}
                projectId='4rywkbjf'
                dataset='production'
              />
            </div>
            <span className={css.price}>${new_price}</span>
            <div className={css.quantityContainer}>
              <h3>Quantity:</h3>
              <div className={css.quantityDescription}>
                <span className={css.minus} onClick={decreaseQuantity}>
                  <AiOutlineMinus />
                </span>
                <span className={css.num}>{qty}</span>
                <span className={css.plus} onClick={increasedQuantity}>
                  <AiOutlinePlus />
                </span>
              </div>
            </div>
            <div className={css.buttonContainer}>
              <button
                type='button'
                className={css.addToCart}
                onClick={() => {
                  addToCart(singleProduct, qty);
                }}
              >
                Add to Cart
              </button>
              <button
                type='button'
                onClick={handleBuyNow}
                className={css.buyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </section>

        <section className={css.productComment}>
          <div className={css.formContainer}>
            <form className={css.form} onSubmit={handleOnSubmit}>
              <section className={css.inputContainer}>
                <label className={css.text}>Name:</label>
                <input
                  className={css.input}
                  type='text'
                  placeholder='John Doe'
                  name='username'
                  ref={usernameEl}
                  value={names}
                  required
                  onChange={(event) => setNames(event.target.value)}
                />
              </section>
              <section className={css.inputContainer}>
                <label className={css.text}>E-mail:</label>
                <input
                  className={css.input}
                  type='email'
                  placeholder='example@company.com'
                  name='username'
                  ref={emailEl}
                  value={email}
                  required
                  onChange={(event) => setEmail(event.target.value)}
                />
              </section>
              <section className={css.inputContainer}>
                <label className={css.text}>Comment:</label>
                <textarea
                  className={css.input}
                  type='text'
                  placeholder='Write something about this product'
                  name='comment'
                  ref={commentsEl}
                  value={commentBody}
                  required
                  onChange={(event) => setCommentBody(event.target.value)}
                />
              </section>
              {showSuccessMessage && (
                <span className={css.submitted}>
                  Refresh after a minutes to see comment.
                </span>
              )}
              <section className={css.CommentButton}>
                <button
                  onClick={handleOnSubmit}
                  type='button'
                  className={css.buyNow}
                >
                  Post Comment
                </button>
              </section>
            </form>

            {commentProduct.commentsData.length !== 0 && (
              <div className={css.commentSectionBox}>
                <div className={css.headerComment}>
                  <span className={css.commentNumber}>
                    {commentProduct.commentsData.length}
                  </span>
                  <h1 className={css.headerText}>Comment Section</h1>
                </div>

                <div className={css.commentBox}>
                  {commentProduct.commentsData?.map((comment) => (
                    <section key={comment?._id} className={css.commentSection}>
                      <div className={css.userAndProduct}>
                        <div className={css.commenterName}>
                          {comment.username}
                        </div>
                        <a href={`/product/${comment.product.slug.current}#`}>
                          <div className={css.commentProductImgAndName}>
                            <img
                              className={css.commentProduct}
                              src={urlFor(comment?.product.image[0])}
                              alt={comment?.product.slug.current}
                            />
                            <div>{comment?.product.name.replace("'", '')}</div>
                          </div>
                        </a>
                      </div>
                      <div className={css.userComment}>
                        <div className={css.commentText}>{comment.comment}</div>
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            )}

            {!commentProduct.commentsData.length && (
              <span>Be the first to leave a comment</span>
            )}
          </div>
        </section>

        <Footer />
      </div>
    );
  }
};
export const getStaticPaths = async () => {
  const query = `*[_type == 'product']{
  slug{
  current
}
}`;

  const slug = await client.fetch(query);

  const paths = slug.map((item) => ({
    params: {
      product: item.slug.current,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params: { product } }) => {
  // Querying for data from backend (SANITY)
  const queryProduct = `*[_type == 'product' && slug.current == "${product}"][0]`;
  const queryComment = `*[_type == 'product' && slug.current == '${product}'][0]{
  'commentsData': *[_type == 'comment' && product._ref == ^._id]{
  _id,
  comment,
  username,
  product->{
  _id,
  slug,
  image,
  name,
}
}
}`;

  // Getting data back from backend (SANITY)
  const singleProduct = await client.fetch(queryProduct);
  const commentProduct = await client.fetch(queryComment);

  if (!singleProduct && !commentProduct) {
    return {
      No_Data: true,
      data: [],
    };
  } else {
    return {
      // And passing the data to props, to render it later.
      props: {
        singleProduct,
        commentProduct: JSON.parse(JSON.stringify(commentProduct)),
      },
    };
  }
  // else if (!commentProduct) {
  //   return {
  //     No_Data: true,
  //     data: [],
  //   };
  // }
};

export default ProductCredentials;
