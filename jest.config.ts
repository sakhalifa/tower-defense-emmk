
const jestConfig = {
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.tsx?$': "@swc/jest",
    },
    roots: [ "src", "tst" ]
}

export default jestConfig
