import {container, FactoryFunction, InjectionToken, instanceCachingFactory} from "tsyringe";
import constructor from "tsyringe/dist/typings/types/constructor.js";


export function registerInstance(...instances: any): void {
    for (const instance of instances) {
        container.registerInstance(instance.constructor, instance);
    }
}

export function getInstanceCashingSingletonFactory<T>(clazz: InjectionToken<T>): FactoryFunction<T> {
    return instanceCachingFactory<T>(c => {
        if (!c.isRegistered(clazz)) {
            c.registerSingleton(clazz as constructor<T>);
        }
        return c.resolve(clazz);
    });
}
