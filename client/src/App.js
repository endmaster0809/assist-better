import React, { useState, useEffect } from 'react';
import './App.css';
import { Formik, Form, Field } from 'formik';
import lunr from 'lunr';

function App() {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [documents, setDocuments] = useState(null);
  const [idx, setIdx] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch('/posts?_embed=comments')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setSearchResults(data);
        InitIdx(data);
        var documents = data.reduce(function (memo, doc) {
          memo[doc.id] = doc;
          return memo;
        }, {});
        setDocuments(documents);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (idx && documents) {
      const results = idx.search(query);
      let documentArray = [];
      results.forEach((result) => {
        let document = documents[result.ref];
        documentArray.push(document);
      });
      console.log(documentArray);
      setSearchResults(documentArray);
    }
  }, [idx, query]);

  const InitIdx = (posts) => {
    var idx = lunr(function () {
      this.ref('id');
      this.field('question');
      this.field('answer');

      posts.forEach(function (doc) {
        this.add(doc);
      }, this);
    });
    setIdx(idx);
  };

  return (
    <div className='App'>
      <div className='App-header'>
        {/* <Formik
          initialValues={{ query: '' }}
          onSubmit={(values, { setSubmitting }) => {
            setQuery(values.query);
            setSubmitting(false);
          }}
        >
          <Form>
            <Field name='query' className='search-input' />
          </Form>
        </Formik> */}
        <Formik
          initialValues={{ email: '', password: '' }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = 'Required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = 'Invalid email address';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <input
                type='email'
                name='email'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.email && touched.email && errors.email}
              <input
                type='password'
                name='password'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {errors.password && touched.password && errors.password}
              <button type='submit' disabled={isSubmitting}>
                Submit
              </button>
            </form>
          )}
        </Formik>
      </div>
      <h1>Results</h1>
      <ul>
        {searchResults.map((post) => (
          <li key={post.id}>{post.anwer}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
