# The "local" environment represents our local testings.
env "local" {
  url = "sqlite://test.db"
  migration {
    dir = "file://./migrations/"
  }
}
