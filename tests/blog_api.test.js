const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const blogObject = new Blog({
  title: 'mLab Blog',
  author: 'mLab',
  url: 'https://blog.mlab.com/',
  likes: 1
})

const blogObjectMissingLikes = new Blog({
  title: 'Google Blog',
  author: 'Google',
  url: 'https://www.blog.google.com/'
})

const blogObjectMissingTitle = new Blog({
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2
})

const blogObjectMissingUrl = new Blog({
  title: 'Type wars',
  author: 'Robert C. Martin',
  likes: 2
})

beforeAll(async () => {
  await Blog.remove({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('api tests', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are six blogs', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(6)
  })

  test('the first blog is about React patterns', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body[0].title).toBe('React patterns')
  })

  test('add a new blog', async () => {
    await api
      .post('/api/blogs')
      .send(blogObject)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('if likes not specified, likes equals 0', async () => {
    const response = await api
      .post('/api/blogs')
      .send(blogObjectMissingLikes)

    expect(response.body.likes).toBe(0)
  })

  test('if no title specified, bad request', async () => {
    await api
      .post('/api/blogs')
      .send(blogObjectMissingTitle)
      .expect(400)
  })

  test('if no url specified, bad request', async () => {
    await api
      .post('/api/blogs')
      .send(blogObjectMissingUrl)
      .expect(400)
  })
})

afterAll(() => {
  server.close()
})