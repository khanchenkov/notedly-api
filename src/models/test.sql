alter table notes drop column favorite_count;
alter table notes add favorite_count int default (0);
delete from favorites where id>0;
select * from notes;

delete from favorites where id>0;
select * from favorites;