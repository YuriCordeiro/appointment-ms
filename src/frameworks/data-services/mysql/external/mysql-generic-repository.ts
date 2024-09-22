import { IGenericRepository } from 'src/core/abstracts/generic-repository.abstract';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class MySqlGenericRepository<T> implements IGenericRepository<T> {
  _repository: Repository<T>;
  _populateOnFind: string[];

  constructor(repository: Repository<T>, populateOnFind: string[] = []) {
    this._repository = repository;
    this._populateOnFind = populateOnFind;
  }

  getAll(): Promise<T[]> {
    return this._repository.find();
  }

  get(id: any): Promise<T> {
    return this._repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  create(item: T): Promise<T> {
    return Promise.resolve(this._repository.save(item));
  }

  update(id: string, item: T) {
    return this._repository.update({ id } as unknown as FindOptionsWhere<T>, item as QueryDeepPartialEntity<T>).then(() => { return this.get(id) });
  }

  delete(id: string) {
    this._repository.delete(id);
  }
}
