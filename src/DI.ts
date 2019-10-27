import 'reflect-metadata';

type Constructor<T = any> = new (...arg: any[]) => T;

const Injectable = (): ClassDecorator => target => {};

class InjectService {
    a = 'inject';
}

@Injectable()
class DemoService {
    constructor(public service: InjectService) {

    }

    test() {
        console.log(this.service.a);
    }

}

const Factory = <T>(target: Constructor<T>): T => {
    const providers = Reflect.getMetadata('design:paramtypes', target) as [];
    const args = providers.map((provider: Constructor) => new provider());
    return new target(...args);
};

Factory(DemoService).test();
