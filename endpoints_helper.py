 #!/usr/bin/python
 # -*- coding: utf-8 -*-
from google.appengine.api import search
from google.appengine.api import memcache
from apiclient.discovery import build
from apiclient import errors
import httplib2
import endpoints
from model import User

FOLDERS = {
            'Account': 'accounts_folder',
            'Contact': 'contacts_folder',
            'Lead': 'leads_folder',
            'Opportunity': 'opportunities_folder',
            'Case': 'cases_folder',
            'Show': 'shows_folder',
            'Feedback': 'feedbacks_folder'
        }

class EndpointsHelper():
    INVALID_TOKEN = 'Invalid token'
    INVALID_GRANT = 'Invalid grant'
    NO_ACCOUNT = 'You don\'t have a i/oGrow account'
    @classmethod
    def update_edge_indexes(cls,parent_key,kind,indexed_edge):
        parent = parent_key.get()
        empty_string = lambda x: x if x else ""
        search_index = search.Index(name="GlobalIndex")
        search_document = search_index.get(str( parent_key.id() ) )
        data = {}
        data['id'] = parent_key.id()
        if search_document:
            for e in search_document.fields:
                if e.name == kind:
                    print 'something before'
                    indexed_edge = empty_string(e.value) + ' ' + str(indexed_edge)
                    print 'something after'
                data[e.name] = e.value
        data[kind] = indexed_edge
        parent.put_index(data)

    @classmethod
    def delete_document_from_index(cls,id):
        search_index = search.Index(name="GlobalIndex")
        search_index.delete(str(id))

    @classmethod
    def require_iogrow_user(cls):
        user = endpoints.get_current_user()
        if user is None:
            raise endpoints.UnauthorizedException(cls.INVALID_TOKEN)
        user_from_email = User.get_by_email(user.email())
        if user_from_email is None:
            raise endpoints.UnauthorizedException(cls.NO_ACCOUNT)
        return user_from_email

    
            
    @classmethod
    def insert_folder(cls, user, folder_name, kind):
        try:
            credentials = user.google_credentials
            http = credentials.authorize(httplib2.Http(memcache))
            service = build('drive', 'v2', http=http)
            organization = user.organization.get()

            # prepare params to insert
            folder_params = {
                        'title': folder_name,
                        'mimeType':  'application/vnd.google-apps.folder'
            }#get the accounts_folder or contacts_folder or ..
            parent_folder = eval('organization.'+FOLDERS[kind])
            if parent_folder:
                folder_params['parents'] = [{'id': parent_folder}]

            # execute files.insert and get resource_id
            created_folder = service.files().insert(body=folder_params,fields='id').execute()
        except:
            raise endpoints.UnauthorizedException(cls.INVALID_GRANT)
        return created_folder

    @classmethod
    def move_folder(cls, user, folder, new_kind):
            credentials = user.google_credentials
            http = credentials.authorize(httplib2.Http(memcache))
            service = build('drive', 'v2', http=http)
            organization = user.organization.get()
            new_parent = eval('organization.' + FOLDERS[new_kind])
            params = {
              "parents":
              [
                {
                  "id": new_parent
                }
              ]
            }
            moved_folder = service.files().patch(**{
                                                    "fileId": folder,
                                                    "body": params,
                                                    "fields": 'id'
                                                    }).execute()
            return moved_folder
    @classmethod
    def read_file(cls, service, drive_file):
            """Download a file's content.

            Args:
                service: Drive API service instance.
                drive_file: Drive File instance.

            Returns:
                File's content if successful, None otherwise.
            """
            download_url = drive_file.get('downloadUrl')
            if download_url:
                print '======Download file=========='
                resp, content = service._http.request(download_url)
                if resp.status == 200:
                    print 'Status: %s' % resp
                    return content.replace('\x00', '')
                else:
                    print 'An error occurred: %s' % resp
                    return None
            else:
                # The file doesn't have any content stored on Drive.
                return None
    @classmethod
    def import_file(cls, user, file_id):
        credentials = user.google_credentials
        http = credentials.authorize(httplib2.Http(memcache))
        service = build('drive', 'v2', http=http)
        try:
            drive_file = service.files().get(fileId=file_id).execute()
            return cls.read_file(service,drive_file)
        except errors.HttpError, error:
            print 'An error occurred: %s' % error
            return None

            
