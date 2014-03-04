from google.appengine.ext import ndb
from google.appengine.datastore.datastore_query import Cursor
from endpoints_proto_datastore.ndb import EndpointsModel
from endpoints_proto_datastore import MessageFieldsSchema
from google.appengine.api import search
from protorpc import messages
import endpoints
from search_helper import tokenize_autocomplete,SEARCH_QUERY_MODEL
import model
from iomodels.crmengine.tags import Tag,TagSchema
from iomodels.crmengine.tasks import Task,TaskRequest,TaskListResponse
from iomodels.crmengine.events import Event,EventListResponse
from iomodels.crmengine.contacts import Contact,ContactListRequest,ContactListResponse
from iomodels.crmengine.opportunities import Opportunity,OpportunityListResponse
from iograph import Node,Edge,InfoNodeListResponse
from iomodels.crmengine.notes import Note,TopicListResponse
from iomodels.crmengine.cases import Case,CaseListResponse
from iomodels.crmengine.documents import Document,DocumentListResponse

# The message class that defines the EntityKey schema
class EntityKeyRequest(messages.Message):
    entityKey = messages.StringField(1)

 # The message class that defines the ListRequest schema
class ListRequest(messages.Message):
    limit = messages.IntegerField(1)
    pageToken = messages.StringField(2)

class AccountGetRequest(messages.Message):
    id = messages.IntegerField(1,required = True)
    contacts = messages.MessageField(ListRequest, 2)
    topics = messages.MessageField(ListRequest, 3)
    tasks = messages.MessageField(ListRequest, 4)
    events = messages.MessageField(ListRequest, 5)
    opportunities = messages.MessageField(ListRequest, 6)
    cases = messages.MessageField(ListRequest, 7)
    documents = messages.MessageField(ListRequest, 8)

class AccountSchema(messages.Message):
    id = messages.StringField(1)
    entityKey = messages.StringField(2)
    name = messages.StringField(3)
    account_type = messages.StringField(4)
    industry = messages.StringField(5)
    tagline = messages.StringField(6)
    introduction = messages.StringField(7)
    tags = messages.MessageField(TagSchema,8, repeated = True)
    contacts = messages.MessageField(ContactListResponse,9)
    infonodes = messages.MessageField(InfoNodeListResponse,10)
    topics = messages.MessageField(TopicListResponse,11)
    tasks = messages.MessageField(TaskListResponse,12)
    events = messages.MessageField(TaskListResponse,13)
    opportunities = messages.MessageField(OpportunityListResponse,14)
    cases = messages.MessageField(CaseListResponse,15)
    documents = messages.MessageField(DocumentListResponse,16)
    created_at = messages.StringField(17)
    updated_at = messages.StringField(18)
    access = messages.StringField(19)

class AccountListRequest(messages.Message):
    limit = messages.IntegerField(1)
    pageToken = messages.StringField(2)
    order = messages.StringField(3)
    tags = messages.StringField(4,repeated = True)
    owner = messages.StringField(5)
    contacts = messages.MessageField(ContactListRequest, 6)
    


class AccountListResponse(messages.Message):
    items = messages.MessageField(AccountSchema, 1, repeated=True)
    nextPageToken = messages.StringField(2)

# The message class that defines the accounts.search response
class AccountSearchResult(messages.Message):
    id = messages.StringField(1)
    entityKey = messages.StringField(2)
    name = messages.StringField(3)

# The message class that defines a set of accounts.search results
class AccountSearchResults(messages.Message):
    items = messages.MessageField(AccountSearchResult, 1, repeated=True)
    nextPageToken = messages.StringField(2)

class Account(EndpointsModel):
    _message_fields_schema = ('id','entityKey','created_at','updated_at', 'folder','access','collaborators_list','phones','emails','addresses','websites','sociallinks', 'collaborators_ids','name','owner','account_type','industry','tagline','introduction')
    # Sharing fields
    owner = ndb.StringProperty()
    collaborators_list = ndb.StructuredProperty(model.Userinfo,repeated=True)
    collaborators_ids = ndb.StringProperty(repeated=True)
    organization = ndb.KeyProperty()
    folder = ndb.StringProperty()
    name = ndb.StringProperty()
    account_type = ndb.StringProperty()
    industry = ndb.StringProperty()
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    updated_at = ndb.DateTimeProperty(auto_now=True)
    tagline = ndb.TextProperty()
    introduction =ndb.TextProperty()
    # public or private
    access = ndb.StringProperty()
    phones = ndb.StructuredProperty(model.Phone,repeated=True)
    emails = ndb.StructuredProperty(model.Email,repeated=True)
    addresses = ndb.StructuredProperty(model.Address,repeated=True)
    websites = ndb.StructuredProperty(model.Website,repeated=True)
    sociallinks= ndb.StructuredProperty(model.Social,repeated=True)


    def put(self, **kwargs):
        ndb.Model.put(self, **kwargs)
        self.put_index()
        self.set_perm()

    def set_perm(self):
        about_item = str(self.key.id())

        perm = model.Permission(about_kind='Account',
                         about_item=about_item,
                         type = 'user',
                         role = 'owner',
                         value = self.owner)
        perm.put()

    def put_index(self,data=None):
        """ index the element at each"""
        empty_string = lambda x: x if x else ""
        collaborators = " ".join(self.collaborators_ids)
        organization = str(self.organization.id())
        emails = " ".join(map(lambda x: x.email,  self.emails))
        phones = " ".join(map(lambda x: x.number,  self.phones))
        websites =  " ".join(map(lambda x: x.website,  self.websites))
        title_autocomplete = ','.join(tokenize_autocomplete(self.name))
        
        #addresses = " \n".join(map(lambda x: " ".join([x.street,x.city,x.state, str(x.postal_code), x.country]) if x else "", self.addresses))
        if data:
            search_key = ['infos','tags']
            for key in search_key:
                if key not in data.keys():
                    data[key] = ""
            my_document = search.Document(
            doc_id = str(data['id']),
            fields=[
                search.TextField(name=u'type', value=u'Account'),
                search.TextField(name='organization', value = empty_string(organization) ),
                search.TextField(name='entityKey',value=empty_string(self.key.urlsafe())),
                search.TextField(name='access', value = empty_string(self.access) ),
                search.TextField(name='owner', value = empty_string(self.owner) ),
                search.TextField(name='collaborators', value = collaborators ),
                search.TextField(name='title', value = empty_string(self.name) ),
                search.TextField(name='account_type', value = empty_string(self.account_type)),
                search.TextField(name='industry', value = empty_string(self.industry)),
                search.DateField(name='created_at', value = self.created_at),
                search.DateField(name='updated_at', value = self.updated_at),
                search.TextField(name='industry', value = empty_string(self.industry)),
                search.TextField(name='tagline', value = empty_string(self.tagline)),
                search.TextField(name='introduction', value = empty_string(self.introduction)),
                search.TextField(name='emails', value = empty_string(emails)),
                search.TextField(name='phones', value = empty_string(phones)),
                search.TextField(name='websites', value = empty_string(websites)),
                search.TextField(name='infos', value= data['infos']),
                search.TextField(name='tags', value= data['tags']),
                search.TextField(name='title_autocomplete', value = empty_string(title_autocomplete)),
                #search.TextField(name='addresses', value = empty_string(addresses)),
               ])
        else:
            my_document = search.Document(
            doc_id = str(self.key.id()),
            fields=[
                search.TextField(name=u'type', value=u'Account'),
                search.TextField(name='organization', value = empty_string(organization) ),
                search.TextField(name='entityKey',value=empty_string(self.key.urlsafe())),
                search.TextField(name='access', value = empty_string(self.access) ),
                search.TextField(name='owner', value = empty_string(self.owner) ),
                search.TextField(name='collaborators', value = collaborators ),
                search.TextField(name='title', value = empty_string(self.name) ),
                search.TextField(name='account_type', value = empty_string(self.account_type)),
                search.TextField(name='industry', value = empty_string(self.industry)),
                search.DateField(name='created_at', value = self.created_at),
                search.DateField(name='updated_at', value = self.updated_at),
                search.TextField(name='industry', value = empty_string(self.industry)),
                search.TextField(name='tagline', value = empty_string(self.tagline)),
                search.TextField(name='introduction', value = empty_string(self.introduction)),
                search.TextField(name='emails', value = empty_string(emails)),
                search.TextField(name='phones', value = empty_string(phones)),
                search.TextField(name='websites', value = empty_string(websites)),
                search.TextField(name='title_autocomplete', value = empty_string(title_autocomplete)),
                #search.TextField(name='addresses', value = empty_string(addresses)),
               ])
        my_index = search.Index(name="GlobalIndex")
        my_index.put(my_document)

    @classmethod
    def get_schema(cls,request):
        account = Account.get_by_id(int(request.id))
        if account is None:
            raise endpoints.NotFoundException('Account not found.')
        #list of tags related to this account
        tag_list = Tag.list_by_parent(account.key)
        # list of infonodes
        infonodes = Node.list_info_nodes(
                                        parent_key = account.key,
                                        request = request
                                        )
        #list of contacts to this account
        contacts = None
        if request.contacts:
            contacts = Contact.list_by_parent(
                                            parent_key = account.key,
                                            request = request
                                        )
        #list of topics related to this account
        topics = None
        if request.topics:
            topics = Note.list_by_parent(
                                        parent_key = account.key,
                                        request = request
                                        )
        tasks = None
        if request.tasks:
            tasks = Task.list_by_parent(
                                        parent_key = account.key,
                                        request = request
                                        )
        events = None
        if request.events:
            events = Event.list_by_parent(
                                        parent_key = account.key,
                                        request = request
                                        )
        opportunities = None
        if request.opportunities:
            opportunities = Opportunity.list_by_parent(
                                        parent_key = account.key,
                                        request = request
                                        )
        cases = None
        if request.cases:
            cases = Case.list_by_parent(
                                        parent_key = account.key,
                                        request = request
                                        )
        documents = None
        if request.documents:
            documents = Document.list_by_parent(
                                        parent_key = account.key,
                                        request = request
                                        )
        account_schema = AccountSchema(
                                  id = str( account.key.id() ),
                                  entityKey = account.key.urlsafe(),
                                  access = account.access,
                                  name = account.name,
                                  account_type = account.account_type,
                                  industry = account.industry,
                                  tagline = account.tagline,
                                  introduction = account.introduction,
                                  tags = tag_list,
                                  contacts = contacts,
                                  topics = topics,
                                  tasks = tasks,
                                  events = events,
                                  opportunities = opportunities,
                                  cases = cases,
                                  documents = documents,
                                  infonodes = infonodes,
                                  created_at = account.created_at.strftime("%Y-%m-%dT%H:%M:00.000"),
                                  updated_at = account.updated_at.strftime("%Y-%m-%dT%H:%M:00.000")
                                )

        return  account_schema
    
    @classmethod
    def list(cls,user_from_email,request):
        curs = Cursor(urlsafe=request.pageToken)
        if request.limit:
            limit = int(request.limit)
        else:
            limit = 10
        items = []
        you_can_loop = True
        count = 0
        while you_can_loop:
            if request.order:
                ascending = True
                if request.order.startswith('-'):
                    order_by = request.order[1:]
                    ascending = False
                else:
                    order_by = request.order
                attr = cls._properties.get(order_by)
                if attr is None:
                    raise AttributeError('Order attribute %s not defined.' % (attr_name,))
                if ascending:
                    accounts, next_curs, more =  cls.query().filter(cls.organization==user_from_email.organization).order(+attr).fetch_page(limit, start_cursor=curs)
                else:
                    accounts, next_curs, more = cls.query().filter(cls.organization==user_from_email.organization).order(-attr).fetch_page(limit, start_cursor=curs)
            else:
                accounts, next_curs, more = cls.query().filter(cls.organization==user_from_email.organization).fetch_page(limit, start_cursor=curs)
            for account in accounts:
                if count<= limit:
                    is_filtered = True
                    if account.access == 'private' and account.owner!=user_from_email.google_user_id:
                        end_node_set = [user_from_email.key]
                        if not Edge.find(start_node=account.key,kind='permissions',end_node_set=end_node_set,operation='AND'):
                            is_filtered = False
                    if request.tags and is_filtered:
                        end_node_set = [ndb.Key(urlsafe=tag_key) for tag_key in request.tags]
                        if not Edge.find(start_node=account.key,kind='tags',end_node_set=end_node_set,operation='AND'):
                            is_filtered = False
                    if request.owner and account.owner!=request.owner and is_filtered:
                        is_filtered = False
                    if is_filtered:
                        count = count + 1
                        #list of tags related to this account
                        tag_list = Tag.list_by_parent(parent_key = account.key)
                        account_schema = AccountSchema(
                                  id = str( account.key.id() ),
                                  entityKey = account.key.urlsafe(),
                                  name = account.name,
                                  account_type = account.account_type,
                                  industry = account.industry,
                                  tagline = account.tagline,
                                  introduction = account.introduction,
                                  tags = tag_list,
                                  created_at = account.created_at.strftime("%Y-%m-%dT%H:%M:00.000"),
                                  updated_at = account.updated_at.strftime("%Y-%m-%dT%H:%M:00.000")
                                )
                        items.append(account_schema)
            if (count == limit):
                you_can_loop = False
            if more and next_curs:
                curs = next_curs
            else:
                you_can_loop = False
        if next_curs and more:
            next_curs_url_safe = next_curs.urlsafe()
        else:
            next_curs_url_safe = None
        return  AccountListResponse(items = items, nextPageToken = next_curs_url_safe)
    
    @classmethod
    def search(cls,user_from_email,request):
        organization = str(user_from_email.organization.id())
        index = search.Index(name="GlobalIndex")
        #Show only objects where you have permissions
        query_string = SEARCH_QUERY_MODEL % {
                               "type": "Account",
                               "query": request.q,
                               "organization": organization,
                               "owner": user_from_email.google_user_id,
                               "collaborators": user_from_email.google_user_id,
                                }
        search_results = []
        if request.limit:
            limit = int(request.limit)
        else:
            limit = 10
        next_cursor = None
        if request.pageToken:
            cursor = search.Cursor(web_safe_string=request.pageToken)
        else:
            cursor = search.Cursor(per_result=True)
        if limit:
            options = search.QueryOptions(limit=limit, cursor=cursor)
        else:
            options = search.QueryOptions(cursor=cursor)
        query = search.Query(query_string=query_string, options=options)
        try:
            if query:
                results = index.search(query)
                #total_matches = results.number_found
                # Iterate over the documents in the results
                for scored_document in results:
                    kwargs = {
                        'id': scored_document.doc_id
                    }
                    for e in scored_document.fields:
                        if e.name in ["entityKey", "title"]:
                            if e.name == "title":
                                kwargs["name"] = e.value
                            else:
                                kwargs[e.name] = e.value
                    search_results.append(AccountSearchResult(**kwargs))
                    next_cursor = scored_document.cursor.web_safe_string
                if next_cursor:
                    next_query_options = search.QueryOptions(
                                                             limit=1,
                                                             cursor=scored_document.cursor
                                                             )
                    next_query = search.Query(
                                              query_string=query_string,
                                              options=next_query_options
                                              )
                    if next_query:
                        next_results = index.search(next_query)
                        if len(next_results.results) == 0:
                            next_cursor = None
        except search.Error:
            logging.exception('Search failed')
        return AccountSearchResults(
                                    items=search_results,
                                    nextPageToken=next_cursor
                                    )








