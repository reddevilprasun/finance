import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { CategoryForm } from './category-form';
import { insertCategoriesSchema } from '@/db/schema';
import { z } from 'zod';
import { useOpenCategory } from '../hooks/use-open-category';
import { useGetCategory } from '../api/use-get-category';
import { Loader2 } from 'lucide-react';
import { useEditCategory } from '../api/use-edit-category';
import { useDeleteCategory } from '../api/use-delete-category';
import { useConfirm } from '@/hooks/use-confirm';

const formSchema = insertCategoriesSchema.pick({
  name: true,
});

type FormValues = z.infer<typeof formSchema>

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();
  const mutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);
  const CategoryQuery = useGetCategory(id);
  const isLoading = CategoryQuery.isLoading;


  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction"
  )

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  }

  const defaultValues = CategoryQuery.data ? {
    name: CategoryQuery.data.name,
  } : {
    name: '',
  }
  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className=' space-y-4'>
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>
              Edit an existing Category.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className=' absolute inset-0 flex items-center justify-center'>
              <Loader2 className="animate-spin size-4 text-muted-foreground" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              onSubmit={onSubmit}
              disabled={mutation.isPending || deleteMutation.isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}